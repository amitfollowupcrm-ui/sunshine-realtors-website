/**
 * Script to list all users from the database
 * Run with: npx tsx scripts/list-users.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('📋 Fetching all users...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        passwordHash: true, // Just to check if password is set (not the actual password)
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ Found ${users.length} users\n`);
    console.log('='.repeat(80));
    console.log('USER LIST');
    console.log('='.repeat(80));
    console.log('');

    users.forEach((user, index) => {
      const hasPassword = !!user.passwordHash;
      const passwordStatus = hasPassword ? '✅ Has Password' : '❌ No Password';

      console.log(`${index + 1}. ${user.fullName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   Verified: ${user.isVerified ? '✅ Yes' : '❌ No'}`);
      console.log(`   Password: ${passwordStatus}`);
      console.log(`   Created: ${user.createdAt.toISOString().split('T')[0]}`);
      console.log(`   Last Login: ${user.lastLoginAt ? user.lastLoginAt.toISOString().split('T')[0] : 'Never'}`);
      console.log('');
    });

    console.log('='.repeat(80));
    console.log(`\nTotal Users: ${users.length}`);
    console.log(`Users with passwords: ${users.filter(u => u.passwordHash).length}`);
    console.log(`Users without passwords: ${users.filter(u => !u.passwordHash).length}`);
    console.log('\n⚠️  Note: Passwords are hashed and cannot be retrieved.');
    console.log('   To reset a password, use the "Forgot Password" feature or create a reset script.');

  } catch (error) {
    console.error('❌ Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
