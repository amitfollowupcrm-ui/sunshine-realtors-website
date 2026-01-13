#!/bin/bash

# Deployment Setup Script
# This script helps set up the project for deployment

echo "🚀 Sunshine Realtors - Deployment Setup"
echo "========================================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ required. Current: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local. Please update with your credentials!"
    echo ""
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm install
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run db:generate
echo ""

# Check Firebase CLI
echo "🔥 Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi
echo "✅ Firebase CLI ready"
echo ""

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Supabase and Upstash credentials"
echo "2. Run: npm run db:push (to setup database)"
echo "3. Run: firebase login"
echo "4. Run: firebase init hosting"
echo "5. Run: npm run build"
echo "6. Run: firebase deploy --only hosting"
echo ""





