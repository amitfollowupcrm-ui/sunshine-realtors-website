// End-to-end login test
const fetch = require('node-fetch');

async function testLogin() {
  console.log('\n🧪 END-TO-END LOGIN TEST\n');
  console.log('='.repeat(60));
  
  const email = 'amitfollowupcrm@gmail.com';
  const password = 'SunshineAdmin@2024!';
  const apiUrl = 'https://sunshine-realtors-website.vercel.app/api/auth/login';

  console.log(`Email: ${email}`);
  console.log(`API: ${apiUrl}`);
  console.log('='.repeat(60) + '\n');

  try {
    console.log('1️⃣  Sending login request...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log(`2️⃣  Response status: ${response.status} ${response.statusText}\n`);

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ LOGIN SUCCESSFUL!\n');
      console.log('User Details:');
      console.log(`   ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Name: ${data.user.fullName}`);
      console.log(`   Role: ${data.user.role}`);
      console.log(`   Active: ${data.user.isActive}`);
      console.log(`   Verified: ${data.user.isVerified}`);
      console.log(`\n   Token: ${data.token.substring(0, 30)}...`);
      console.log(`\n✅ Login is working correctly!`);
    } else {
      console.log('❌ LOGIN FAILED!\n');
      console.log('Error Response:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.log(`\n💡 Error: ${data.error}`);
        
        if (data.details) {
          console.log(`   Details: ${data.details}`);
        }
        
        // Suggest fixes based on error
        if (data.error.includes('Database connection')) {
          console.log('\n🔧 Fix: Check DATABASE_URL on Vercel');
        } else if (data.error.includes('Invalid email or password')) {
          console.log('\n🔧 Fix: Verify password is correct in database');
        }
      }
    }

  } catch (error) {
    console.error('\n❌ Request Error:', error.message);
    console.error(error);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

testLogin();


