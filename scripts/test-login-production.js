// Test login credentials against production database
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres',
    },
  },
});

async function testLogin() {
  const email = 'amitfollowupcrm@gmail.com';
  const password = 'Admin@2024#Secure';

  console.log('\n🧪 Testing Login Credentials...\n');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}\n`);

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      console.log('❌ User not found in database!');
      return;
    }

    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Full Name: ${user.fullName}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Is Active: ${user.isActive}`);
    console.log(`   Is Verified: ${user.isVerified}`);
    console.log(`   Has Password: ${!!user.passwordHash}\n`);

    if (!user.passwordHash) {
      console.log('❌ ERROR: User has no password hash!');
      return;
    }

    // Test password
    console.log('🔐 Testing password...');
    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log(`   Password Match: ${isValid ? '✅ YES' : '❌ NO'}\n`);

    if (!isValid) {
      console.log('❌ Password does not match!');
      console.log('\n💡 Let me update the password...');
      
      // Update password
      const newPasswordHash = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { email },
        data: {
          passwordHash: newPasswordHash,
          role: 'SUPER_ADMIN',
          isActive: true,
          isVerified: true,
          emailVerifiedAt: new Date(),
          permissions: ['*'],
        },
      });

      console.log('✅ Password updated!');
      
      // Test again
      const newIsValid = await bcrypt.compare(password, newPasswordHash);
      console.log(`   New Password Match: ${newIsValid ? '✅ YES' : '❌ NO'}\n`);
    }

    if (!user.isActive) {
      console.log('⚠️  WARNING: User is not active!');
    }

    if (!user.isVerified) {
      console.log('⚠️  WARNING: User is not verified!');
    }

    console.log('\n✅ Login test complete!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();



