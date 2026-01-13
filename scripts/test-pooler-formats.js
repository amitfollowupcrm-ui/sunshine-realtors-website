// Test different transaction pooler URL formats
const { PrismaClient } = require('@prisma/client');

const password = 'Supabasesecure16';
const passwordEncoded = encodeURIComponent(password);

// Different URL formats to try
const formats = [
  // Format 1: With aws-0- prefix
  `postgresql://postgres.cgodlegdxrwhpjevxlel:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
  
  // Format 2: Without aws-0- prefix
  `postgresql://postgres.cgodlegdxrwhpjevxlel:${password}@ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
  
  // Format 3: Direct pooler hostname (checking if it's just pooler.supabase.com)
  `postgresql://postgres.cgodlegdxrwhpjevxlel:${password}@pooler.supabase.com:6543/postgres?pgbouncer=true`,
  
  // Format 4: With encoded password
  `postgresql://postgres.cgodlegdxrwhpjevxlel:${passwordEncoded}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
  
  // Format 5: Transaction pooler format (different port or params)
  `postgresql://postgres.cgodlegdxrwhpjevxlel:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
  
  // Format 6: Alternative format from Supabase docs
  `postgresql://postgres.cgodlegdxrwhpjevxlel:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`,
];

console.log('\n🧪 Testing Different Transaction Pooler URL Formats\n');

async function testFormat(url, index) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    await prisma.$connect();
    console.log(`✅ Format ${index + 1} - CONNECTED!`);
    
    const user = await prisma.user.findUnique({
      where: { email: 'amitfollowupcrm@gmail.com' },
      select: { email: true, role: true },
    });
    
    if (user) {
      console.log(`   ✅ User found: ${user.email} (${user.role})`);
      console.log(`\n🎉 WORKING FORMAT FOUND!\n`);
      console.log(`📋 USE THIS URL ON VERCEL:`);
      console.log(`\n${url}\n`);
      return true;
    } else {
      console.log(`   ⚠️  Connected but user not found`);
    }
  } catch (error) {
    if (error.message.includes('Tenant or user not found')) {
      console.log(`❌ Format ${index + 1} - Wrong format/region`);
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.log(`❌ Format ${index + 1} - Host not found`);
    } else {
      console.log(`❌ Format ${index + 1} - ${error.message.substring(0, 60)}...`);
    }
  } finally {
    await prisma.$disconnect();
  }
  return false;
}

async function testAll() {
  for (let i = 0; i < formats.length; i++) {
    const url = formats[i];
    console.log(`\nTesting Format ${i + 1}: ${url.substring(0, 80)}...`);
    const success = await testFormat(url, i);
    if (success) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

testAll().catch(console.error);



