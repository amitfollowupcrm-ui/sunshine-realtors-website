// Build script for Firebase Hosting static export
// Temporarily excludes API routes since they can't be statically exported

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiDir = path.join(__dirname, '..', 'app', 'api');
const apiBackupDir = path.join(__dirname, '..', '.api.backup');

console.log('📦 Building for Firebase Hosting (Static Export)...\n');

try {
  // Step 1: Backup API routes (they can't be statically exported)
  if (fs.existsSync(apiDir)) {
    console.log('⚠️  Temporarily moving API routes (not supported in static export)...');
    if (fs.existsSync(apiBackupDir)) {
      fs.rmSync(apiBackupDir, { recursive: true, force: true });
    }
    fs.renameSync(apiDir, apiBackupDir);
    console.log('✅ API routes moved to backup\n');
  }

  // Step 2: Build static export
  console.log('🔨 Building static export...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✅ Static build completed!\n');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Step 3: Restore API routes
  if (fs.existsSync(apiBackupDir)) {
    console.log('🔄 Restoring API routes...');
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
    }
    fs.renameSync(apiBackupDir, apiDir);
    console.log('✅ API routes restored\n');
  }
}

console.log('✨ Build complete! Ready for Firebase deployment.');
console.log('📁 Static files are in the "out" directory.');
console.log('\n🚀 Deploy with: firebase deploy --only hosting\n');

