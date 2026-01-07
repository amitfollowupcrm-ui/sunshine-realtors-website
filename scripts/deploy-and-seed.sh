#!/bin/bash

# Deployment and Seeding Script
# This script deploys the database migration and seeds dummy data

echo "🚀 Starting deployment process..."

# Step 1: Deploy database migration
echo "📦 Step 1: Deploying database migration..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Migration failed. Please check your database connection."
    exit 1
fi

echo "✅ Migration deployed successfully!"

# Step 2: Generate Prisma client
echo "📦 Step 2: Generating Prisma client..."
npx prisma generate

echo "✅ Prisma client generated!"

# Step 3: Seed dummy data
echo "📦 Step 3: Seeding dummy data with images..."
node scripts/seed-dummy-properties.js

if [ $? -ne 0 ]; then
    echo "❌ Seeding failed. Please check the error above."
    exit 1
fi

echo "✅ Dummy data seeded successfully!"

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📊 Summary:"
echo "   - Database migration: ✅"
echo "   - Prisma client: ✅"
echo "   - Dummy data: ✅"
echo ""
echo "🔗 Your properties are now live with high-quality images!"


