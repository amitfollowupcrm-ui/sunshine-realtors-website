// Test connection pooler URL
const { PrismaClient } = require('@prisma/client');

const poolerUrl = 'postgresql://postgres.cgodlegdxrwhpjevxlel:%4016Supabase@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

console.log('\n🧪 Testing Connection Pooler URL\n');
console.log('URL:', poolerUrl.replace('%4016Supabase', '***'));

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
      select: { email: true, role: true },
    });
    
    if (user) {
      console.log('✅ User found:', user.email, '- Role:', user.role);
    }
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();

