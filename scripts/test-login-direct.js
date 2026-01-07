// Test login directly against the API
const fetch = require('node-fetch');

async function testLogin() {
  const email = 'amitfollowupcrm@gmail.com';
  const password = 'SunshineAdmin@2024!';
  const apiUrl = 'https://sunshine-realtors-website.vercel.app/api/auth/login';

  console.log('\n🧪 Testing Login API...\n');
  console.log(`Email: ${email}`);
  console.log(`API URL: ${apiUrl}\n`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
      console.log(`   User: ${data.user.email}`);
      console.log(`   Role: ${data.user.role}`);
      console.log(`   Token: ${data.token.substring(0, 20)}...`);
    } else {
      console.log('\n❌ LOGIN FAILED!');
      console.log(`   Error: ${data.error || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('\n❌ Request Error:', error.message);
    console.error(error);
  }
}

testLogin();


