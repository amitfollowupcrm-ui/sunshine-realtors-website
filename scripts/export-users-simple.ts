/**
 * Simple script to export users with emails and roles
 * Run with: npx tsx scripts/export-users-simple.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function exportUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      select: {
        email: true,
        fullName: true,
        role: true,
      },
      orderBy: {
        email: 'asc',
      },
    });

    console.log('\n=== WEBSITE USERS (Sunshine Realtors) ===\n');
    console.log('EMAIL'.padEnd(50) + ' | NAME'.padEnd(30) + ' | ACCESS LEVEL');
    console.log('-'.repeat(95));

    users.forEach((user) => {
      const email = (user.email || '').padEnd(50);
      const name = (user.fullName || 'N/A').padEnd(30);
      const role = user.role || 'N/A';
      console.log(`${email} | ${name} | ${role}`);
    });

    console.log('-'.repeat(95));
    console.log(`\nTotal: ${users.length} users\n`);

    // Also output as JSON for easy parsing
    console.log('\n=== JSON FORMAT ===\n');
    console.log(JSON.stringify(users.map(u => ({
      email: u.email,
      name: u.fullName,
      accessLevel: u.role
    })), null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportUsers();
