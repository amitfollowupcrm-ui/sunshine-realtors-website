// Script to verify and test admin credentials
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function verifyCredentials() {
  const email = 'amitfollowupcrm@gmail.com';
  const testPasswords = [
    'SunshineAdmin@2024!',
    'Admin@2024#Secure',
    'Admin123!',
  ];

  console.log('\n🔍 Verifying Admin Credentials...\n');
  console.log(`Email: ${email}\n`);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        passwordHash: true,
        isActive: true,
        isVerified: true,
      },
    });

    if (!user) {
      console.log('❌ User not found in database!');
      return;
    }

    console.log('✅ User found in database!');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.fullName}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Verified: ${user.isVerified}`);
    console.log(`   Has Password: ${user.passwordHash ? 'Yes' : 'No'}`);
    console.log(`   Password Hash: ${user.passwordHash?.substring(0, 20)}...`);

    console.log('\n🔐 Testing Passwords...\n');
    
    let matched = false;
    for (const password of testPasswords) {
      if (user.passwordHash) {
        const isValid = await bcrypt.compare(password, user.passwordHash);
        console.log(`   "${password}" ${isValid ? '✅ MATCH!' : '❌ No match'}`);
        if (isValid) {
          matched = true;
          console.log('\n🎉 CORRECT PASSWORD FOUND!\n');
          console.log('='.repeat(60));
          console.log('📋 CORRECT CREDENTIALS:');
          console.log('='.repeat(60));
          console.log(`   Email: ${email}`);
          console.log(`   Password: ${password}`);
          console.log('='.repeat(60) + '\n');
        }
      }
    }

    if (!matched) {
      console.log('\n⚠️  None of the test passwords matched!');
      console.log('\n🔄 Setting new password: SunshineAdmin@2024!\n');
      
      const newPasswordHash = await bcrypt.hash('SunshineAdmin@2024!', 12);
      
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

      console.log('✅ Password updated successfully!');
      console.log('\n' + '='.repeat(60));
      console.log('📋 NEW CREDENTIALS:');
      console.log('='.repeat(60));
      console.log(`   Email: ${email}`);
      console.log(`   Password: SunshineAdmin@2024!`);
      console.log('='.repeat(60) + '\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCredentials();


