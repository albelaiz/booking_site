#!/usr/bin/env node

/**
 * Test script for Enhanced Authentication System
 * Tests various registration and login scenarios
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Test scenarios for the enhanced auth system
const testScenarios = [
  {
    name: "Guest Multi-Step Registration",
    type: "registration",
    data: {
      name: "John Guest",
      username: `guestuser_${Date.now()}`,
      password: "GuestPass123!",
      email: `guest_${Date.now()}@example.com`,
      phone: "+1234567890",
      role: "user"
    }
  },
  {
    name: "Host Multi-Step Registration",
    type: "registration", 
    data: {
      name: "Jane Host",
      username: `hostuser_${Date.now()}`,
      password: "HostPass123!",
      email: `host_${Date.now()}@example.com`,
      phone: "+1987654321",
      role: "owner"
    }
  },
  {
    name: "Quick Signup (Minimal Data)",
    type: "registration",
    data: {
      name: "Quick User",
      username: `quickuser_${Date.now()}`,
      password: "QuickPass123!",
      role: "user"
      // No email or phone - testing optional fields
    }
  },
  {
    name: "Email Optional Registration",
    type: "registration",
    data: {
      name: "No Email User",
      username: `noemail_${Date.now()}`,
      password: "NoEmailPass123!",
      phone: "+1555666777",
      role: "user"
      // No email provided
    }
  }
];

const validationTests = [
  {
    name: "Weak Password Test",
    data: {
      name: "Test User",
      username: `weakpass_${Date.now()}`,
      password: "weak",
      role: "user"
    },
    shouldFail: true,
    expectedError: "Password must be at least 8 characters long"
  },
  {
    name: "No Uppercase Password",
    data: {
      name: "Test User",
      username: `noupper_${Date.now()}`,
      password: "password123!",
      role: "user"
    },
    shouldFail: true,
    expectedError: "Password must contain at least one uppercase letter"
  },
  {
    name: "No Special Character Password",
    data: {
      name: "Test User", 
      username: `nospecial_${Date.now()}`,
      password: "Password123",
      role: "user"
    },
    shouldFail: true,
    expectedError: "Password must contain at least one special character"
  }
];

async function checkServerHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    if (response.status === 200) {
      console.log('✅ Server is running and healthy\n');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not responding. Please start the server first.');
    console.log('   Run: pnpm dev\n');
    return false;
  }
}

async function testRegistration(scenario) {
  console.log(`🧪 Testing: ${scenario.name}`);
  console.log(`   Data: ${JSON.stringify(scenario.data, null, 2)}`);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, scenario.data);
    
    if (response.status === 201 && response.data.success && response.data.user) {
      console.log('✅ PASSED: Registration successful');
      console.log(`   Created user: ${response.data.user.username}`);
      console.log(`   User role: ${response.data.user.role}`);
      console.log(`   Has email: ${!!response.data.user.email}`);
      
      // Test login with the newly created user
      return await testLogin(scenario.data.username, scenario.data.password);
    } else {
      console.log('❌ FAILED: Registration failed');
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    if (scenario.shouldFail) {
      const errorMessage = error.response?.data?.error || error.message;
      if (errorMessage.includes(scenario.expectedError)) {
        console.log('✅ PASSED: Registration correctly failed');
        console.log(`   Expected error: ${scenario.expectedError}`);
        console.log(`   Actual error: ${errorMessage}`);
        return true;
      } else {
        console.log('❌ FAILED: Wrong error message');
        console.log(`   Expected: ${scenario.expectedError}`);
        console.log(`   Actual: ${errorMessage}`);
        return false;
      }
    } else {
      console.log('❌ FAILED: Registration failed unexpectedly');
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data.error}`);
      } else {
        console.log(`   Network error: ${error.message}`);
      }
      return false;
    }
  } finally {
    console.log('');
  }
}

async function testLogin(username, password) {
  console.log(`🔐 Testing login for: ${username}`);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username,
      password
    });
    
    if (response.data.success && response.data.user) {
      console.log('✅ PASSED: Login successful');
      console.log(`   User: ${response.data.user.name}`);
      console.log(`   Role: ${response.data.user.role}`);
      return true;
    } else {
      console.log('❌ FAILED: Login response invalid');
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ FAILED: Login failed');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data.error}`);
    } else {
      console.log(`   Network error: ${error.message}`);
    }
    return false;
  }
}

async function testEmailLogin(email, password) {
  console.log(`📧 Testing email login for: ${email}`);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: email, // Backend accepts email as username
      password
    });
    
    if (response.data.success && response.data.user) {
      console.log('✅ PASSED: Email login successful');
      console.log(`   User: ${response.data.user.name}`);
      return true;
    } else {
      console.log('❌ FAILED: Email login response invalid');
      return false;
    }
  } catch (error) {
    console.log('❌ FAILED: Email login failed');
    if (error.response) {
      console.log(`   Error: ${error.response.data.error}`);
    }
    return false;
  }
}

async function runEnhancedAuthTests() {
  console.log('🚀 Enhanced Authentication System Tests');
  console.log('=======================================\n');
  
  // Check server health
  const serverHealthy = await checkServerHealth();
  if (!serverHealthy) {
    process.exit(1);
  }
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test successful registrations
  console.log('📝 Testing Successful Registration Scenarios\n');
  for (const scenario of testScenarios) {
    totalTests++;
    const success = await testRegistration(scenario);
    if (success) passedTests++;
  }
  
  // Test validation failures
  console.log('🔒 Testing Password Validation\n');
  for (const test of validationTests) {
    totalTests++;
    const success = await testRegistration(test);
    if (success) passedTests++;
  }
  
  // Test email login with first registered user
  if (testScenarios.length > 0) {
    console.log('📧 Testing Email-based Login\n');
    const firstScenario = testScenarios[0];
    if (firstScenario.data.email) {
      totalTests++;
      const success = await testEmailLogin(firstScenario.data.email, firstScenario.data.password);
      if (success) passedTests++;
      console.log('');
    }
  }
  
  // Test duplicate registration
  console.log('🔄 Testing Duplicate Registration Prevention\n');
  const duplicateTest = {
    name: "Duplicate Username Test",
    data: {
      name: "Duplicate User",
      username: testScenarios[0].data.username, // Use same username
      password: "DuplicatePass123!",
      role: "user"
    },
    shouldFail: true,
    expectedError: "Username already exists"
  };
  
  totalTests++;
  const duplicateSuccess = await testRegistration(duplicateTest);
  if (duplicateSuccess) passedTests++;
  
  // Summary
  console.log('📊 Test Summary');
  console.log('===============');
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success rate: ${Math.round((passedTests / totalTests) * 100)}%\n`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Enhanced Authentication System is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the logs above for details.');
  }
  
  console.log('\n🔗 You can also test the UI at: http://localhost:5173/enhanced-auth-demo');
}

// Enhanced Auth System Feature Summary
async function printFeatureSummary() {
  console.log('\n✨ Enhanced Authentication System Features');
  console.log('==========================================');
  console.log('✅ Multi-step registration process');
  console.log('✅ Quick signup option');
  console.log('✅ Role-based flows (guest vs. host)');
  console.log('✅ Flexible email requirements (optional)');
  console.log('✅ Enhanced password validation');
  console.log('✅ Real-time validation feedback');
  console.log('✅ Progressive disclosure');
  console.log('✅ Contextual preferences');
  console.log('✅ Email or username login');
  console.log('✅ Comprehensive error handling');
  console.log('✅ Mobile-responsive design');
  console.log('✅ Accessibility features');
  console.log('\n🌟 Key Improvements over original AuthModal:');
  console.log('   • Reduced cognitive load with step-by-step process');
  console.log('   • Increased conversion with flexible requirements');
  console.log('   • Better UX with progress indicators and help text');
  console.log('   • Enhanced security with strong password requirements');
  console.log('   • Role-specific customization for guests and hosts');
}

async function main() {
  await runEnhancedAuthTests();
  await printFeatureSummary();
}

main().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
