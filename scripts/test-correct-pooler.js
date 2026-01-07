// Test the correct transaction pooler URL
const { PrismaClient } = require('@prisma/client');

const url = 'postgresql://postgres.cgodlegdxrwhpjevxlel:Supabasesecure16@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

console.log('\n🧪 Testing Correct Transaction Pooler URL\n');
console.log('URL:', url.replace('Supabasesecure16', '***'));

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: url,
    },
  },
});

async function test() {
  try {
    await prisma.$connect();
    console.log('\n✅ Connection successful!\n');
    
    const user = await prisma.user.findUnique({
      where: { email: 'amitfollowupcrm@gmail.com' },
      select: { email: true, role: true, fullName: true },
    });
    
    if (user) {
      console.log('✅ User found!');
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.fullName}`);
      console.log(`   Role: ${user.role}`);
      console.log('\n🎉 Transaction pooler connection works perfectly!');
      console.log('\n📋 URL to use on Vercel:');
      console.log(`\n${url}\n`);
    } else {
      console.log('\n⚠️  User not found (but connection works)');
    }
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();


