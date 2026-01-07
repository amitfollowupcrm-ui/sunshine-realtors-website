// Test database connection with the exact connection string format
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres';

console.log('Testing database connection...');
console.log('Connection string (first 30 chars):', connectionString.substring(0, 30) + '...');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionString,
    },
  },
  log: ['error', 'warn', 'query'],
});

async function testConnection() {
  try {
    console.log('\nAttempting to connect...');
    await prisma.$connect();
    console.log('✅ Connected successfully!');
    
    const userCount = await prisma.user.count();
    console.log(`✅ Database accessible! User count: ${userCount}`);
    
    const testUser = await prisma.user.findUnique({
      where: { email: 'amitfollowupcrm@gmail.com' },
    });
    
    if (testUser) {
      console.log('✅ Test user found:', {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role,
      });
    } else {
      console.log('⚠️  Test user not found');
    }
    
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('\nFull error:', error);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check if Supabase database is running');
      console.log('2. Verify connection string format');
      console.log('3. Check if IP restrictions are enabled in Supabase');
      console.log('4. Try using connection pooler URL instead');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

