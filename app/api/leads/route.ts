import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';
import { LeadSource, LeadStatus, InquiryType } from '@prisma/client';

// POST /api/leads - Create a new inquiry/lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, name, email, phone, message, inquiryType } = body;

    // Validation
    if (!propertyId || !name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Property ID, name, and phone are required' },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, ownerId: true },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Get current user (optional - for logged-in users)
    const user = await getCurrentUser(request);

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        source: LeadSource.PROPERTY_INQUIRY,
        propertyId,
        name,
        email: email || null,
        phone,
        inquiryType: inquiryType || InquiryType.BUY,
        notes: message || null,
        status: LeadStatus.NEW,
        priority: 'medium',
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            city: true,
            state: true,
          },
        },
      },
    });

    // Increment inquiry count on property
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        inquiryCount: { increment: 1 },
      },
    });

    // Create activity log
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: user?.userId || null,
        activityType: 'INQUIRY_CREATED',
        title: 'Property Inquiry Submitted',
        description: `Inquiry submitted for property: ${property.title}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully',
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        createdAt: lead.createdAt,
        property: lead.property,
      },
    });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to submit inquiry',
      },
      { status: 500 }
    );
  }
}

// GET /api/leads - Get all leads (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (assignedTo) {
      where.assignedToId = assignedTo;
    }

    // Fetch leads
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              city: true,
              state: true,
              primaryImageUrl: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
          activities: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch leads',
      },
      { status: 500 }
    );
  }
}


