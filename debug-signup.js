#!/usr/bin/env node

/**
 * Debug script to manually test signup functionality
 * This allows you to test specific scenarios interactively
 */

import axios from 'axios';
import readline from 'readline';

const BASE_URL = 'http://localhost:5000';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function testSignup(userData) {
  try {
    console.log('\n🔄 Attempting to register user...');
    console.log('User data:', JSON.stringify(userData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    
    console.log('✅ Registration successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return true;
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Registration failed!');
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('❌ Network error:', error.message);
    }
    return false;
  }
}

async function testLogin(username, password) {
  try {
    console.log('\n🔄 Attempting to login...');
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username,
      password
    });
    
    console.log('✅ Login successful!');
    console.log('Response status:', response.status);
    console.log('User:', JSON.stringify(response.data.user, null, 2));
    
    return true;
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Login failed!');
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('❌ Network error:', error.message);
    }
    return false;
  }
}

async function checkServerHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    if (response.status === 200) {
      console.log('✅ Server is running and healthy');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not responding. Please start the server first.');
    console.log('   Run: pnpm dev');
    return false;
  }
}

async function showExamples() {
  console.log('\n📋 Password Requirements:');
  console.log('- At least 8 characters long');
  console.log('- At least one uppercase letter (A-Z)');
  console.log('- At least one lowercase letter (a-z)');
  console.log('- At least one number (0-9)');
  console.log('- At least one special character (!@#$%^&*)');
  console.log('\n✅ Valid password examples:');
  console.log('- "MyPassword123!"');
  console.log('- "SecurePass1@"');
  console.log('- "TestUser2023#"');
  console.log('\n❌ Invalid password examples:');
  console.log('- "password" (no uppercase, no number, no special char)');
  console.log('- "PASSWORD123!" (no lowercase)');
  console.log('- "MyPass1!" (too short)');
}

async function main() {
  console.log('🔐 Signup/Login Debug Tool');
  console.log('==========================');
  
  // Check if server is running
  const serverHealthy = await checkServerHealth();
  if (!serverHealthy) {
    rl.close();
    return;
  }
  
  while (true) {
    console.log('\n📝 Choose an option:');
    console.log('1. Test signup');
    console.log('2. Test login');
    console.log('3. Show password requirements');
    console.log('4. Exit');
    
    const choice = await question('\nEnter your choice (1-4): ');
    
    switch (choice) {
      case '1':
        console.log('\n📝 Creating new user...');
        const username = await question('Username (min 3 chars): ');
        const name = await question('Full name (min 2 chars): ');
        const email = await question('Email (optional, press Enter to skip): ');
        const phone = await question('Phone (optional, press Enter to skip): ');
        const password = await question('Password: ');
        
        const userData = {
          username: username.trim(),
          name: name.trim(),
          password: password,
        };
        
        if (email.trim()) userData.email = email.trim();
        if (phone.trim()) userData.phone = phone.trim();
        
        await testSignup(userData);
        break;
        
      case '2':
        console.log('\n🔐 Login test...');
        const loginUser = await question('Username or email: ');
        const loginPass = await question('Password: ');
        
        await testLogin(loginUser, loginPass);
        break;
        
      case '3':
        showExamples();
        break;
        
      case '4':
        console.log('\n👋 Goodbye!');
        rl.close();
        return;
        
      default:
        console.log('❌ Invalid choice. Please enter 1-4.');
    }
  }
}

// Run the debug tool if this script is executed directly
main().catch(error => {
  console.error('Debug tool error:', error);
  rl.close();
});
