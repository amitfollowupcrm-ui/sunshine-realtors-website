import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';
import { PropertyCategory, PropertyType, PropertyStatus, FurnishingStatus, PossessionStatus } from '@prisma/client';

// Seeding endpoint - should only be accessible to super admin
// Also supports GET method for easier browser access with secret key
export async function GET(request: NextRequest) {
  return await seedProperties(request);
}

export async function POST(request: NextRequest) {
  return await seedProperties(request);
}

async function seedProperties(request: NextRequest) {
  try {
    // For initial seeding, allow with a secret key query parameter
    // TODO: Remove this in production or make it more secure
    const { searchParams } = new URL(request.url);
    const secretKey = searchParams.get('key');
    
    if (secretKey !== 'seed2024') {
      const user = await getCurrentUser(request);
      if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. Only admins can seed data. Add ?key=seed2024 for initial seeding.' },
          { status: 403 }
        );
      }
    }

    // Cities and states for seeding
    const cities = [
      { name: 'Mohali', state: 'Punjab' },
      { name: 'Zirakpur', state: 'Punjab' },
      { name: 'Kharar', state: 'Punjab' },
      { name: 'Kasauli', state: 'Himachal Pradesh' },
      { name: 'Panchkula', state: 'Haryana' },
    ];

    const propertyTypes = [
      PropertyType.APARTMENT,
      PropertyType.VILLA,
      PropertyType.PENTHOUSE,
      PropertyType.STUDIO,
      PropertyType.PLOT,
    ];

    // Get or create a seller user
    let seller = await prisma.user.findFirst({
      where: { role: 'SELLER' },
    });

    if (!seller) {
      seller = await prisma.user.create({
        data: {
          email: `seller${Date.now()}@sunshinerealtors.com`,
          fullName: 'Demo Seller',
          passwordHash: 'dummy', // Not used for seeding
          role: 'SELLER',
          isActive: true,
          phone: '+91-9876543210',
        },
      });
    }

    const propertyImages = {
      [PropertyType.APARTMENT]: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80&auto=format&fit=crop',
      ],
      [PropertyType.VILLA]: [
        'https://images.unsplash.com/photo-1564013799907-f0f596dc3aa3?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop',
      ],
      [PropertyType.PENTHOUSE]: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop',
      ],
      [PropertyType.STUDIO]: [
        'https://images.unsplash.com/photo-1570129477490-0c001107037c?w=800&q=80&auto=format&fit=crop',
      ],
      [PropertyType.PLOT]: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80&auto=format&fit=crop',
      ],
    };

    const properties = [];
    let propertyCount = 0;

    for (const city of cities) {
      for (const propertyType of propertyTypes) {
        // Create 3-5 properties per city per type
        const count = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < count; i++) {
          const bedrooms = propertyType === PropertyType.PLOT ? null : Math.floor(Math.random() * 4) + 1;
          const bathrooms = propertyType === PropertyType.PLOT ? null : bedrooms || 1;
          const builtUpArea = propertyType === PropertyType.PLOT 
            ? Math.floor(Math.random() * 500) + 100 
            : Math.floor(Math.random() * 1500) + 500;
          
          const basePrice = propertyType === PropertyType.PLOT 
            ? builtUpArea * 2000 
            : builtUpArea * 5000;
          const price = Math.floor(basePrice + (Math.random() * basePrice * 0.5));

          const availableImages = propertyImages[propertyType] || propertyImages[PropertyType.APARTMENT];
          const numImages = Math.floor(Math.random() * 3) + 3;
          const selectedImages = [];
          for (let j = 0; j < numImages; j++) {
            selectedImages.push(availableImages[Math.floor(Math.random() * availableImages.length)]);
          }

          const property = await prisma.property.create({
            data: {
              title: `${bedrooms || 'Luxury'} ${propertyType} in ${city.name}`,
              slug: `${propertyType.toLowerCase()}-${city.name.toLowerCase()}-${propertyCount + 1}-${Date.now()}`,
              description: `Beautiful ${propertyType.toLowerCase()} located in prime area of ${city.name}, ${city.state}. Perfect for ${bedrooms ? bedrooms + ' BHK' : 'your dream home'}.`,
              category: PropertyCategory.BUY,
              propertyType,
              status: PropertyStatus.ACTIVE,
              price,
              city: city.name,
              state: city.state,
              locality: `Sector ${Math.floor(Math.random() * 50) + 1}`,
              bedrooms,
              bathrooms,
              builtUpArea,
              carpetArea: Math.floor(builtUpArea * 0.8),
              furnishingStatus: FurnishingStatus.SEMI_FURNISHED,
              possessionStatus: PossessionStatus.READY_TO_MOVE,
              listedById: seller.id,
              primaryImageUrl: selectedImages[0],
              imageUrls: selectedImages,
              isVerified: true,
              ageOfConstruction: Math.floor(Math.random() * 10),
            },
          });

          properties.push(property);
          propertyCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${propertyCount} properties`,
      propertiesCreated: propertyCount,
    });
  } catch (error: any) {
    console.error('Error seeding properties:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to seed properties',
      },
      { status: 500 }
    );
  }
}

