#!/usr/bin/env node

/**
 * Debug login issues
 * Test real user login scenarios
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testLoginIssue() {
  console.log('🔍 Debug Login Issues');
  console.log('=====================\n');
  
  // First, let's create a user to test with
  console.log('1. Creating a test user...');
  try {
    const createResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      username: 'testloginuser',
      password: 'TestPassword123!',
      name: 'Test Login User',
      email: 'testlogin@example.com'
    });
    
    console.log('✅ User created successfully');
    console.log(`   Username: ${createResponse.data.user.username}`);
    console.log(`   User ID: ${createResponse.data.user.id}`);
    console.log(`   Response structure:`, JSON.stringify(createResponse.data, null, 2));
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('✅ User already exists (that\'s fine for testing)');
    } else {
      console.log('❌ Failed to create user:', error.response?.data || error.message);
      return;
    }
  }
  
  // Now let's test login
  console.log('\n2. Testing login with correct credentials...');
  try {
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'testloginuser',
      password: 'TestPassword123!'
    });
    
    console.log('✅ Login successful!');
    console.log('   Response structure:', JSON.stringify(loginResponse.data, null, 2));
    console.log('   Has success field:', 'success' in loginResponse.data);
    console.log('   Has user field:', 'user' in loginResponse.data);
    
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('   Status:', error.response?.status);
    console.log('   Error data:', JSON.stringify(error.response?.data, null, 2));
  }
  
  // Test login with wrong password
  console.log('\n3. Testing login with wrong password...');
  try {
    const wrongResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'testloginuser',
      password: 'WrongPassword123!'
    });
    
    console.log('❌ Wrong password was accepted! This is a problem.');
    console.log('   Response:', JSON.stringify(wrongResponse.data, null, 2));
    
  } catch (error) {
    console.log('✅ Wrong password correctly rejected');
    console.log('   Status:', error.response?.status);
    console.log('   Error:', error.response?.data?.error);
  }
  
  // Test with one of the seeded users
  console.log('\n4. Testing login with seeded admin user...');
  try {
    const adminResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'admin',
      password: 'password123'
    });
    
    console.log('✅ Admin login successful!');
    console.log('   Response structure:', JSON.stringify(adminResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ Admin login failed!');
    console.log('   Status:', error.response?.status);
    console.log('   Error data:', JSON.stringify(error.response?.data, null, 2));
  }
}

async function checkServer() {
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Server is running\n');
    return true;
  } catch (error) {
    console.log('❌ Server not responding\n');
    return false;
  }
}

async function main() {
  const serverHealthy = await checkServer();
  if (!serverHealthy) {
    process.exit(1);
  }
  
  await testLoginIssue();
}

main().catch(error => {
  console.error('Debug error:', error);
  process.exit(1);
});
