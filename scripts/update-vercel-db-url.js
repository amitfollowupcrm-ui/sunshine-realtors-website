// Script to help update DATABASE_URL on Vercel
console.log('\n🔧 DATABASE_URL Configuration for Vercel\n');
console.log('='.repeat(60));

const connectionStrings = {
  direct: 'postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres',
  pooler: 'postgresql://postgres.cgodlegdxrwhpjevxlel:@16Supabase@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
};

console.log('✅ RECOMMENDED: Connection Pooler (for serverless/Vercel)');
console.log('   Use this for Vercel production:');
console.log(`\n   ${connectionStrings.pooler}\n`);
console.log('📋 To set on Vercel, run:');
console.log('   vercel env add DATABASE_URL production');
console.log('   (Then paste the pooler URL above)\n');

console.log('='.repeat(60));
console.log('\n⚠️  IMPORTANT: After updating, redeploy:');
console.log('   vercel --prod\n');

