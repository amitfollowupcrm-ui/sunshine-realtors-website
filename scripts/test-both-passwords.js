// Test both password options with the transaction pooler
const { PrismaClient } = require('@prisma/client');

const passwords = ['Supabasesecure16', 'Supabasesecure@16'];
const urlTemplate = 'postgresql://postgres.cgodlegdxrwhpjevxlel:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

console.log('\n🧪 Testing Both Password Options\n');

async function testPassword(password) {
  const url = urlTemplate.replace('[PASSWORD]', encodeURIComponent(password));
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    await prisma.$connect();
    console.log(`✅ Password: ${password} - CONNECTED!`);
    
    const user = await prisma.user.findUnique({
      where: { email: 'amitfollowupcrm@gmail.com' },
      select: { email: true, role: true, fullName: true },
    });
    
    if (user) {
      console.log(`   ✅ User found: ${user.email} (${user.role})`);
      console.log(`\n🎉 WORKING PASSWORD FOUND: ${password}`);
      console.log(`\n📋 CORRECT URL:`);
      console.log(`\n${url}\n`);
      return { success: true, password, url };
    } else {
      console.log(`   ⚠️  Connected but user not found`);
      return { success: false, password };
    }
  } catch (error) {
    if (error.message.includes('Authentication failed')) {
      console.log(`❌ Password: ${password} - Authentication failed`);
    } else if (error.message.includes('Tenant or user not found')) {
      console.log(`❌ Password: ${password} - Wrong credentials`);
    } else {
      console.log(`❌ Password: ${password} - ${error.message.substring(0, 60)}...`);
    }
    return { success: false, password };
  } finally {
    await prisma.$disconnect();
  }
}

async function testAll() {
  for (const password of passwords) {
    const result = await testPassword(password);
    if (result.success) {
      return result;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('\n⚠️  Neither password worked from local machine.');
  console.log('💡 This might work on Vercel servers. Trying Supabasesecure16 first...');
  return null;
}

testAll().catch(console.error);



