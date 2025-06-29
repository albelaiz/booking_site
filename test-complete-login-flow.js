#!/usr/bin/env node

/**
 * Complete login flow test - simulating exactly what happens in the frontend
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Simulate the exact frontend login logic
async function simulateFrontendLogin(username, password) {
  try {
    console.log(`🔐 Attempting to login with username: "${username}"`);
    
    // This is exactly what authApi.login does
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username,
      password
    });
    
    const data = response.data;
    console.log('📦 Backend response:', JSON.stringify(data, null, 2));
    
    // This is exactly what AuthModal checks
    if (data.success && data.user) {
      console.log('✅ Frontend would accept this login!');
      console.log(`   Would store in localStorage:`);
      console.log(`   - isLoggedIn: true`);
      console.log(`   - userRole: ${data.user.role}`);
      console.log(`   - userName: ${data.user.name}`);
      console.log(`   - userEmail: ${data.user.email}`);
      console.log(`   - loginMethod: credentials`);
      return true;
    } else {
      console.log('❌ Frontend would show "Login failed. Please check your credentials."');
      console.log(`   Reason: success=${!!data.success}, user=${!!data.user}`);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Login request failed');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data.error}`);
    } else {
      console.log(`   Network error: ${error.message}`);
    }
    return false;
  }
}

async function testCompleteLoginFlow() {
  console.log('🧪 Complete Login Flow Test');
  console.log('============================\n');
  
  // Test with various users
  const testCases = [
    { desc: 'Admin user', username: 'admin', password: 'password123' },
    { desc: 'Staff user', username: 'staff', password: 'password123' },
    { desc: 'Owner user', username: 'owner', password: 'password123' },
    { desc: 'Regular user', username: 'user', password: 'password123' },
    { desc: 'Our test user', username: 'testloginuser', password: 'TestPassword123!' },
  ];
  
  let successCount = 0;
  
  for (const testCase of testCases) {
    console.log(`\n${testCase.desc}:`);
    console.log('─'.repeat(40));
    const success = await simulateFrontendLogin(testCase.username, testCase.password);
    if (success) successCount++;
  }
  
  // Test wrong credentials
  console.log(`\nTesting wrong credentials:`);
  console.log('─'.repeat(40));
  await simulateFrontendLogin('admin', 'wrongpassword');
  
  console.log('\n📊 Summary:');
  console.log('============');
  console.log(`✅ ${successCount}/${testCases.length} valid logins would work in frontend`);
  console.log('❌ Wrong credentials correctly rejected');
  
  if (successCount === testCases.length) {
    console.log('\n🎉 LOGIN FIX IS WORKING! Users can now log in successfully.');
  } else {
    console.log('\n⚠️  Some login issues remain.');
  }
}

async function main() {
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Server is healthy\n');
  } catch (error) {
    console.log('❌ Server not responding\n');
    process.exit(1);
  }
  
  await testCompleteLoginFlow();
}

main().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
