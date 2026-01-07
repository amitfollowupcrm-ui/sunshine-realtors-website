// Test transaction pooler with different common regions
const { PrismaClient } = require('@prisma/client');

const regions = [
  'ap-south-1',      // Asia Pacific (Mumbai) - most common for Indian users
  'ap-southeast-1',  // Asia Pacific (Singapore)
  'ap-southeast-2',  // Asia Pacific (Sydney)
  'us-east-1',       // US East
  'us-west-1',       // US West
  'eu-west-1',       // Europe (Ireland)
  'eu-central-1',    // Europe (Frankfurt)
];

const password = 'Supabasesecure16';

console.log('\n🧪 Testing Transaction Pooler with Different Regions\n');
console.log(`Password: ${password}`);
console.log(`Format: postgresql://postgres.cgodlegdxrwhpjevxlel:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true\n`);

let foundWorking = false;

async function testRegion(region) {
  const url = `postgresql://postgres.cgodlegdxrwhpjevxlel:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    await prisma.$connect();
    console.log(`✅ ${region} - CONNECTED!`);
    
    const user = await prisma.user.findUnique({
      where: { email: 'amitfollowupcrm@gmail.com' },
      select: { email: true, role: true },
    });
    
    if (user) {
      console.log(`   ✅ User found: ${user.email} (${user.role})`);
      console.log(`\n🎉 CORRECT REGION FOUND: ${region}`);
      console.log(`\n📋 USE THIS URL ON VERCEL:`);
      console.log(`\n${url}\n`);
      foundWorking = true;
      return true;
    } else {
      console.log(`   ⚠️  Connected but user not found`);
    }
  } catch (error) {
    if (error.message.includes('Tenant or user not found')) {
      console.log(`❌ ${region} - Wrong region (Tenant not found)`);
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.log(`❌ ${region} - Host not found`);
    } else {
      console.log(`❌ ${region} - ${error.message.substring(0, 60)}...`);
    }
  } finally {
    await prisma.$disconnect();
  }
  return false;
}

async function testAll() {
  for (const region of regions) {
    if (foundWorking) break;
    await testRegion(region);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
  }
  
  if (!foundWorking) {
    console.log('\n⚠️  None of the common regions worked.');
    console.log('💡 Please check your Supabase dashboard for the exact region.');
  }
}

testAll().catch(console.error);


