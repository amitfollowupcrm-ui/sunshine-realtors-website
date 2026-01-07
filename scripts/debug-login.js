// Debug script to test login flow end-to-end
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres',
    },
  },
});

async function debugLogin() {
  const email = 'amitfollowupcrm@gmail.com';
  const password = 'Admin@2024#Secure';

  console.log('\n🔍 Debugging Login Flow...\n');

  try {
    // Step 1: Find user
    console.log('Step 1: Finding user...');
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      hasPassword: !!user.passwordHash,
      passwordHashLength: user.passwordHash?.length,
    });

    // Step 2: Check password hash
    if (!user.passwordHash) {
      console.log('❌ No password hash!');
      return;
    }

    // Step 3: Test password comparison
    console.log('\nStep 2: Testing password comparison...');
    console.log(`Input password: "${password}"`);
    console.log(`Password hash starts with: ${user.passwordHash.substring(0, 10)}...`);
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log(`Password match: ${isValid ? '✅ YES' : '❌ NO'}`);

    if (!isValid) {
      console.log('\n⚠️  Password mismatch! Creating new hash...');
      
      // Create new hash
      const newHash = await bcrypt.hash(password, 12);
      console.log(`New hash created: ${newHash.substring(0, 10)}...`);
      
      // Update in database
      await prisma.user.update({
        where: { email },
        data: { passwordHash: newHash },
      });
      
      console.log('✅ Password hash updated in database');
      
      // Test new hash
      const newIsValid = await bcrypt.compare(password, newHash);
      console.log(`New password match: ${newIsValid ? '✅ YES' : '❌ NO'}`);
    }

    // Step 4: Test with different password variations
    console.log('\nStep 3: Testing password variations...');
    const variations = [
      password,
      password.trim(),
      password + ' ',
      ' ' + password,
    ];

    for (const variant of variations) {
      const match = await bcrypt.compare(variant, user.passwordHash);
      console.log(`"${variant}" → ${match ? '✅ MATCH' : '❌ NO MATCH'}`);
    }

    console.log('\n✅ Debug complete!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();

