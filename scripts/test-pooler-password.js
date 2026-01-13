// Test transaction pooler with the direct connection password
const { PrismaClient } = require('@prisma/client');

// Try with the direct connection password that we know works
const passwords = ['@16Supabase', 'Supabasesecure16'];
const regions = ['ap-south-1', 'ap-southeast-1', 'us-east-1', 'eu-west-1'];

console.log('\n🧪 Testing Transaction Pooler with Different Passwords\n');

async function testPassword(password, region) {
  const url = `postgresql://postgres.cgodlegdxrwhpjevxlel:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    await prisma.$connect();
    console.log(`✅ Password: ${password.substring(0, 10)}..., Region: ${region} - CONNECTED!`);
    
    const user = await prisma.user.findUnique({
      where: { email: 'amitfollowupcrm@gmail.com' },
      select: { email: true, role: true },
    });
    
    if (user) {
      console.log(`   ✅ User found: ${user.email} (${user.role})`);
      console.log(`\n🎉 WORKING COMBINATION FOUND!\n`);
      console.log(`📋 USE THIS URL ON VERCEL:`);
      console.log(`\n${url}\n`);
      return true;
    } else {
      console.log(`   ⚠️  Connected but user not found`);
    }
  } catch (error) {
    if (error.message.includes('Tenant or user not found')) {
      // This means connection works but auth failed - try next password/region
      return false;
    } else {
      // Network error - try next region
      return false;
    }
  } finally {
    await prisma.$disconnect();
  }
  return false;
}

async function testAll() {
  for (const password of passwords) {
    for (const region of regions) {
      const success = await testPassword(password, region);
      if (success) return;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  console.log('\n⚠️  None of the combinations worked.');
  console.log('💡 The connection string format in Supabase dashboard should show the exact URL.');
}

testAll().catch(console.error);



