// Script to create Super Admin user in PRODUCTION database
// Usage: DATABASE_URL="your-production-url" node scripts/create-admin-production.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Use production DATABASE_URL from environment
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function createSuperAdmin() {
  const email = 'amitfollowupcrm@gmail.com';
  const password = 'Admin@2024#Secure'; // Simple, secure password
  const fullName = 'Super Admin';

  console.log('\n🔐 Creating Super Admin User in PRODUCTION...\n');
  console.log(`Email: ${email}`);
  console.log(`Name: ${fullName}`);
  console.log(`Password: ${password}\n`);

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    if (existingUser) {
      console.log('⚠️  User already exists! Updating to Super Admin...\n');
      
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
    console.log('\n📋 PRODUCTION Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Login URL: https://sunshine-realtors-website.vercel.app/login`);
    console.log(`   Admin Dashboard: https://sunshine-realtors-website.vercel.app/admin`);
    console.log('\n✅ These credentials work on the LIVE site!\n');

  } catch (error) {
    console.error('\n❌ Error creating Super Admin:');
    console.error(error.message);
    if (error.code === 'P1001') {
      console.error('\n💡 Database connection failed. Make sure DATABASE_URL is set correctly.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();

