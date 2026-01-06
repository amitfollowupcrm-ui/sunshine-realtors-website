// GET /api/search/autocomplete - Autocomplete search suggestions

import { NextRequest, NextResponse } from 'next/server';
import { cache, CacheKeys } from '@/config/redis';
import { prisma } from '@/config/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // city, locality, project, all

    if (q.length < 2) {
      return NextResponse.json(
        {
          success: true,
          data: {
            suggestions: [],
          },
        },
        { status: 200 }
      );
    }

    // Check cache
    const cacheKey = `autocomplete:${q}:${type}`;
    const cached = await cache.get<any>(cacheKey);
    if (cached) {
      return NextResponse.json(
        {
          success: true,
          data: cached,
        },
        { status: 200 }
      );
    }

    const suggestions: any[] = [];

    // Search cities
    if (type === 'all' || type === 'city') {
      const cities = await prisma.property.findMany({
        where: {
          city: {
            contains: q,
            mode: 'insensitive',
          },
          status: 'ACTIVE',
        },
        select: {
          city: true,
        },
        distinct: ['city'],
        take: 5,
      });

      cities.forEach((city) => {
        suggestions.push({
          type: 'city',
          text: city.city,
          value: city.city,
        });
      });
    }

    // Search localities
    if (type === 'all' || type === 'locality') {
      const localities = await prisma.property.findMany({
        where: {
          locality: {
            contains: q,
            mode: 'insensitive',
          },
          status: 'ACTIVE',
        },
        select: {
          locality: true,
          city: true,
        },
        distinct: ['locality'],
        take: 5,
      });

      localities.forEach((loc) => {
        if (loc.locality) {
          suggestions.push({
            type: 'locality',
            text: `${loc.locality}, ${loc.city}`,
            value: loc.locality,
            city: loc.city,
          });
        }
      });
    }

    // Search projects
    if (type === 'all' || type === 'project') {
      const projects = await prisma.project.findMany({
        where: {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
        select: {
          name: true,
          city: true,
        },
        take: 5,
      });

      projects.forEach((project) => {
        suggestions.push({
          type: 'project',
          text: `${project.name}, ${project.city}`,
          value: project.name,
          city: project.city,
        });
      });
    }

    const result = {
      suggestions: suggestions.slice(0, 10), // Limit to 10 total
    };

    // Cache for 10 minutes
    await cache.set(cacheKey, result, 600);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Autocomplete error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred',
        },
      },
      { status: 500 }
    );
  }
}

