// Test database connection from local machine to production database
const { PrismaClient } = require('@prisma/client');

// Use the DATABASE_URL from environment or .env file
// This should match what's on Vercel
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function testConnection() {
  console.log('\n🔍 Testing Production Database Connection...\n');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // Test query - find the admin user
    const email = 'amitfollowupcrm@gmail.com';
    console.log(`🔍 Looking for user: ${email}\n`);
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        isVerified: true,
        passwordHash: true,
      },
    });

    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('✅ User found!');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.fullName}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Verified: ${user.isVerified}`);
    console.log(`   Has Password: ${user.passwordHash ? 'Yes' : 'No'}`);
    
    if (user.passwordHash) {
      console.log(`   Password Hash: ${user.passwordHash.substring(0, 30)}...`);
    }

    // Test password verification
    const bcrypt = require('bcryptjs');
    const testPassword = 'SunshineAdmin@2024!';
    const isValid = await bcrypt.compare(testPassword, user.passwordHash);
    
    console.log(`\n🔐 Password Test:`);
    console.log(`   Test Password: ${testPassword}`);
    console.log(`   Match: ${isValid ? '✅ YES' : '❌ NO'}`);

    if (!isValid) {
      console.log('\n⚠️  Password mismatch! Let me check other possible passwords...');
      
      const otherPasswords = [
        'Admin@2024#Secure',
        'Admin123!',
        'SunshineAdmin2024!',
      ];
      
      for (const pwd of otherPasswords) {
        const match = await bcrypt.compare(pwd, user.passwordHash);
        if (match) {
          console.log(`   ✅ Found match: ${pwd}`);
          break;
        }
      }
    }

    console.log('\n✅ Database connection and user verification complete!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n💡 Issue: Cannot connect to database server');
      console.log('   - Check DATABASE_URL is correct');
      console.log('   - Check Supabase firewall settings');
      console.log('   - Try using connection pooler URL');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

