// Generate secure random secrets for JWT
// Run: node scripts/generate-secrets.js

const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(32).toString('hex');
}

console.log('🔐 Generated JWT Secrets:');
console.log('');
console.log('JWT_SECRET=' + generateSecret());
console.log('JWT_REFRESH_SECRET=' + generateSecret());
console.log('');
console.log('Copy these values to your .env.local file');

