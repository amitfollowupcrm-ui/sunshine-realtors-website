// Test the new pooler connection with correct password
const { PrismaClient } = require('@prisma/client');

const poolerUrl = 'postgresql://postgres.cgodlegdxrwhpjevxlel:Supabasesecure16@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

console.log('\n🧪 Testing New Connection Pooler URL\n');
console.log('URL:', poolerUrl.replace('Supabasesecure16', '***'));

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: poolerUrl,
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
      console.log('\n✅ Pooler connection works perfectly!');
    } else {
      console.log('\n⚠️  User not found (but connection works)');
    }
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    
    if (error.message.includes('Tenant or user not found')) {
      console.log('\n💡 The region might be wrong. Try:');
      console.log('   - aws-0-ap-south-1 (current)');
      console.log('   - aws-0-us-east-1');
      console.log('   - aws-0-eu-west-1');
      console.log('\n   Check your Supabase dashboard for the correct region.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

test();

