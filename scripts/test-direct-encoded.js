// Test direct connection with URL-encoded password
const { PrismaClient } = require('@prisma/client');

const directUrl = 'postgresql://postgres:%4016Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres';

console.log('\n🧪 Testing Direct Connection with URL-Encoded Password\n');
console.log('URL:', directUrl.replace('%4016Supabase', '***'));

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

async function test() {
  try {
    await prisma.$connect();
    console.log('\n✅ Connection successful!\n');
    
    const user = await prisma.user.findUnique({
      where: { email: 'amitfollowupcrm@gmail.com' },
      select: { email: true, role: true },
    });
    
    if (user) {
      console.log('✅ User found:', user.email, '- Role:', user.role);
      console.log('\n✅ This connection string works!');
    }
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();


