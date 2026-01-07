// Test Database Connection Script
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...\n');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);
    
    const propertyCount = await prisma.property.count();
    console.log(`🏠 Total properties in database: ${propertyCount}`);
    
    const leadCount = await prisma.lead.count();
    console.log(`📞 Total leads in database: ${leadCount}\n`);
    
    console.log('✅ Database is ready for use!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();


