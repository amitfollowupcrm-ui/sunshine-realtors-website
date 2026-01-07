// Script to set amitfollowupcrm@gmail.com as SUPER_ADMIN
// Usage: node scripts/set-superadmin-amit.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setSuperAdmin() {
  const email = 'amitfollowupcrm@gmail.com';
  const password = 'SunshineAdmin@2024!'; // Secure password
  const fullName = 'Super Admin - Amit';

  console.log('\n🔐 Setting Super Admin User...\n');
  console.log(`Email: ${email}`);
  console.log(`Name: ${fullName}`);
  console.log(`Password: ${password}\n`);

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('⚠️  User already exists! Updating to Super Admin...\n');
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Update to Super Admin
      const admin = await prisma.user.update({
        where: { email },
        data: {
          passwordHash,
          fullName,
          role: 'SUPER_ADMIN',
          isVerified: true,
          isActive: true,
          emailVerifiedAt: new Date(),
          permissions: ['*'], // All permissions
        },
      });

      console.log('✅ User updated to Super Admin successfully!');
      console.log(`ID: ${admin.id}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
      console.log(`Status: ${admin.isActive ? 'Active' : 'Inactive'}`);
      console.log(`Verified: ${admin.isVerified ? 'Yes' : 'No'}`);
    } else {
      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create Super Admin
      const admin = await prisma.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          role: 'SUPER_ADMIN',
          isVerified: true,
          isActive: true,
          emailVerifiedAt: new Date(),
          permissions: ['*'], // All permissions
        },
      });

      console.log('✅ Super Admin created successfully!');
      console.log(`ID: ${admin.id}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
    }

    console.log('\n🎉 Super Admin is ready to use!');
    console.log('\n' + '='.repeat(60));
    console.log('📋 LOGIN CREDENTIALS');
    console.log('='.repeat(60));
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔗 Access Links:');
    console.log(`   Admin Login: https://sunshine-realtors-website.vercel.app/admin/login`);
    console.log(`   Admin Control Panel: https://sunshine-realtors-website.vercel.app/admin/control-panel`);
    console.log(`   Regular Login: https://sunshine-realtors-website.vercel.app/login`);
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error setting Super Admin:');
    console.error(error.message);
    if (error.code === 'P2002') {
      console.error('\n💡 User with this email already exists. Use a different email or update existing user.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setSuperAdmin();

