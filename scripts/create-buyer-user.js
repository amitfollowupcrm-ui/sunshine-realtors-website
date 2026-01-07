// Create buyer user
// Usage: node scripts/create-buyer-user.js "postgresql://..."

try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {}

const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const connectionString = process.argv[2] || process.env.DATABASE_URL;
const dbUrl = connectionString?.includes('pooler.supabase.com') 
  ? (connectionString.includes('?') ? connectionString + '&pgbouncer=true' : connectionString + '?pgbouncer=true')
  : connectionString;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

async function createBuyer() {
  const email = 'rtsolutiontesting@gmail.com';
  const password = '12341234';
  const fullName = 'RT Solution Testing';

  console.log('\n🔐 Creating Buyer User...\n');
  console.log(`Email: ${email}`);
  console.log(`Name: ${fullName}`);
  console.log(`Password: ${password}\n`);

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: UserRole.BUYER,
        isVerified: true,
        isActive: true,
        emailVerifiedAt: new Date(),
        fullName: fullName,
      },
      create: {
        email,
        passwordHash,
        fullName,
        role: UserRole.BUYER,
        isVerified: true,
        isActive: true,
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✅ Buyer user created/updated successfully!');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Status: ${user.isActive ? 'Active' : 'Inactive'}\n`);

  } catch (error) {
    console.error('\n❌ Error creating buyer:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createBuyer();

