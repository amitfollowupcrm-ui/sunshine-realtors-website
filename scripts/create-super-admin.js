// Script to create Super Admin user
// Usage: node scripts/create-super-admin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  // Admin credentials (change these!)
  const email = process.env.ADMIN_EMAIL || 'admin@sunshinerealtors.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const fullName = process.env.ADMIN_NAME || 'Super Admin';
  const phone = process.env.ADMIN_PHONE || null;

  console.log('\n🔐 Creating Super Admin User...\n');
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
          role: 'SUPER_ADMIN',
          isVerified: true,
          isActive: true,
          emailVerifiedAt: new Date(),
          permissions: ['*'], // All permissions
        },
      });

      console.log('✅ User updated to Super Admin successfully!');
      console.log(`ID: ${admin.id}`);
      console.log(`Role: ${admin.role}`);
    } else {
      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create Super Admin
      const admin = await prisma.user.create({
        data: {
          email,
          phone,
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
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Login URL: https://sunshine-realtors-website.vercel.app/login`);
    console.log(`   Admin Dashboard: https://sunshine-realtors-website.vercel.app/admin`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

  } catch (error) {
    console.error('\n❌ Error creating Super Admin:');
    console.error(error.message);
    if (error.code === 'P2002') {
      console.error('\n💡 User with this email already exists. Use a different email or update existing user.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();


