// Seeder with explicit connection string support
// Usage: node scripts/seed-with-connection.js "postgresql://..."

// Try to load dotenv if available
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, that's okay
}
const { PrismaClient, PropertyCategory, PropertyType, PropertyStatus, FurnishingStatus, PossessionStatus, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Use provided connection string or environment variable
const connectionString = process.argv[2] || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found!');
  console.error('Usage: node scripts/seed-with-connection.js "postgresql://..."');
  console.error('Or set DATABASE_URL in .env.local');
  process.exit(1);
}

// Use connection string as-is (should already have pgbouncer=true if needed)
const dbUrl = connectionString;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

// Copy the rest from seed-dummy-properties.js
// Cities and their states
const cities = [
  { name: 'Mohali', state: 'Punjab', localities: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Sector 70', 'Sector 71', 'Sector 82'] },
  { name: 'Zirakpur', state: 'Punjab', localities: ['VIP Road', 'Ambala Highway', 'Patiala Road', 'Sector 20', 'Baltana'] },
  { name: 'Kharar', state: 'Punjab', localities: ['Kharar Main', 'Landran Road', 'Sector 125', 'Sector 126'] },
  { name: 'Kasauli', state: 'Himachal Pradesh', localities: ['Kasauli Main', 'Dharampur', 'Garkhal', 'Mall Road'] },
  { name: 'Panchkula', state: 'Haryana', localities: ['Sector 1', 'Sector 5', 'Sector 7', 'Sector 12', 'Sector 14', 'Sector 20', 'Sector 21'] },
];

const propertyTypes = [
  PropertyType.APARTMENT,
  PropertyType.VILLA,
  PropertyType.PENTHOUSE,
  PropertyType.SHOP,
  PropertyType.OFFICE,
  PropertyType.PLOT,
];

const propertyImages = {
  [PropertyType.APARTMENT]: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80&auto=format&fit=crop',
  ],
  [PropertyType.VILLA]: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&auto=format&fit=crop',
  ],
  [PropertyType.PENTHOUSE]: [
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80&auto=format&fit=crop',
  ],
  [PropertyType.SHOP]: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80&auto=format&fit=crop',
  ],
  [PropertyType.OFFICE]: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80&auto=format&fit=crop',
  ],
  [PropertyType.PLOT]: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
  ],
};

const furnishingOptions = [
  FurnishingStatus.UNFURNISHED,
  FurnishingStatus.SEMI_FURNISHED,
  FurnishingStatus.FULLY_FURNISHED,
];

const possessionOptions = [
  PossessionStatus.READY_TO_MOVE,
  PossessionStatus.UNDER_CONSTRUCTION,
  PossessionStatus.RESALE,
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateProperty(city, ownerId) {
  const propertyType = randomChoice(propertyTypes);
  const category = randomChoice([PropertyCategory.BUY, PropertyCategory.RENT]);
  const locality = randomChoice(city.localities);
  const furnishing = randomChoice(furnishingOptions);
  const possession = randomChoice(possessionOptions);
  
  let basePrice = 3000000;
  if (propertyType === PropertyType.VILLA) basePrice = 8000000;
  if (propertyType === PropertyType.PENTHOUSE) basePrice = 12000000;
  if (propertyType === PropertyType.PLOT) basePrice = 2000000;
  if (category === PropertyCategory.RENT) basePrice = basePrice * 0.005;
  
  const price = Math.round(basePrice * randomFloat(0.7, 1.5));
  const bedrooms = propertyType === PropertyType.PLOT ? null : randomChoice([1, 2, 3, 4, 5]);
  const bathrooms = propertyType === PropertyType.PLOT ? null : bedrooms ? randomInt(1, bedrooms) : null;
  const area = propertyType === PropertyType.PLOT 
    ? randomInt(1000, 5000) 
    : randomInt(800, 3500);
  
  const title = `${bedrooms ? bedrooms + ' BHK' : 'Plot'} ${propertyType} for ${category === PropertyCategory.BUY ? 'Sale' : 'Rent'} in ${locality}, ${city.name}`;
  
  const description = `Beautiful ${propertyType.toLowerCase()} in ${locality}, ${city.name}. ${furnishing} property with ${possession.toLowerCase()} status. Perfect location with all modern amenities. Contact for more details.`;
  
  const amenities = [
    'Parking',
    'Security',
    'Power Backup',
    'Lift',
    'Gym',
    'Swimming Pool',
    'Park',
    'Shopping Mall Nearby',
  ].slice(0, randomInt(3, 6));
  
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100) + '-' + Date.now().toString().slice(-8);
  
  const availableImages = propertyImages[propertyType] || propertyImages[PropertyType.APARTMENT];
  const numImages = randomInt(3, 5);
  const selectedImages = [];
  for (let i = 0; i < numImages; i++) {
    selectedImages.push(availableImages[Math.floor(Math.random() * availableImages.length)]);
  }
  
  return {
    ownerId,
    title,
    description,
    slug,
    category,
    propertyType,
    country: 'India',
    state: city.state,
    city: city.name,
    locality,
    sector: locality.includes('Sector') ? locality.match(/\d+/)?.[0] : null,
    pincode: randomChoice(['140301', '140302', '140308', '160017', '134109']),
    addressLine1: `${randomInt(1, 999)} ${locality}`,
    price,
    currency: 'INR',
    negotiable: Math.random() > 0.5,
    builtUpArea: propertyType !== PropertyType.PLOT ? area : null,
    carpetArea: propertyType !== PropertyType.PLOT ? Math.round(area * 0.85) : null,
    plotArea: propertyType === PropertyType.PLOT ? area : null,
    areaUnit: 'sqft',
    bedrooms,
    bathrooms,
    balconies: bedrooms ? randomInt(1, 2) : null,
    floors: randomInt(2, 10),
    floorNumber: randomInt(1, 10),
    furnishingStatus: furnishing,
    parking: randomInt(1, 3),
    powerBackup: true,
    waterSupply: 'municipal',
    amenities,
    possessionStatus: possession,
    availableFrom: possession === PossessionStatus.READY_TO_MOVE ? new Date() : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    constructionYear: possession === PossessionStatus.RESALE ? randomInt(2015, 2023) : null,
    status: PropertyStatus.ACTIVE,
    isVerified: true,
    primaryImageUrl: selectedImages[0],
    imageUrls: selectedImages,
    videoUrls: [],
    floorPlanUrls: [],
  };
}

async function seedProperties() {
  console.log('\n🌱 Starting property seeding...\n');
  console.log(`📡 Using connection: ${dbUrl.replace(/:[^:@]+@/, ':****@')}\n`);

  try {
    let seller = await prisma.user.findFirst({
      where: { role: UserRole.SELLER },
    });

    if (!seller) {
      console.log('Creating seller user...');
      const passwordHash = await bcrypt.hash('Seller123!', 12);
      seller = await prisma.user.create({
        data: {
          email: 'seller@sunshinerealtors.com',
          fullName: 'Test Seller',
          passwordHash,
          role: UserRole.SELLER,
          isVerified: true,
          isActive: true,
          emailVerifiedAt: new Date(),
        },
      });
      console.log('✅ Seller user created');
    }

    const properties = [];
    for (const city of cities) {
      const count = randomInt(15, 25);
      console.log(`Generating ${count} properties for ${city.name}, ${city.state}...`);
      
      for (let i = 0; i < count; i++) {
        const property = generateProperty(city, seller.id);
        properties.push(property);
      }
    }

    console.log(`\n📦 Creating ${properties.length} properties...`);
    
    const batchSize = 10;
    let created = 0;
    for (let i = 0; i < properties.length; i += batchSize) {
      const batch = properties.slice(i, i + batchSize);
      await prisma.property.createMany({
        data: batch,
        skipDuplicates: true,
      });
      created += batch.length;
      console.log(`  ✅ Created ${created}/${properties.length} properties`);
    }

    console.log('\n🎉 Property seeding completed!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Total properties: ${properties.length}`);
    console.log(`   - Cities: ${cities.map(c => c.name).join(', ')}`);
    console.log(`   - Seller: ${seller.email}`);
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error seeding properties:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedProperties();

