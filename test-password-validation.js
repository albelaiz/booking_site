#!/usr/bin/env node

/**
 * Test to verify that invalid passwords do NOT get saved to the database
 * This ensures that password validation works correctly both frontend and backend
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Test cases for invalid passwords
const invalidPasswordTests = [
  {
    name: 'Too short password',
    password: '1234567', // Only 7 characters
    expectedError: 'Password must be at least 8 characters long'
  },
  {
    name: 'No uppercase letter',
    password: 'password123!',
    expectedError: 'Password must contain at least one uppercase letter'
  },
  {
    name: 'No lowercase letter',
    password: 'PASSWORD123!',
    expectedError: 'Password must contain at least one lowercase letter'
  },
  {
    name: 'No number',
    password: 'Password!',
    expectedError: 'Password must contain at least one number'
  },
  {
    name: 'No special character',
    password: 'Password123',
    expectedError: 'Password must contain at least one special character'
  },
  {
    name: 'Empty password',
    password: '',
    expectedError: 'Password must be at least 8 characters long'
  }
];

// Valid password for comparison
const validPasswordTest = {
  name: 'Valid password',
  password: 'ValidPass123!',
  shouldSucceed: true
};

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testPasswordValidation() {
  console.log('🧪 Testing Password Validation - Invalid Passwords Should NOT Be Saved\n');
  
  let testNumber = 1;
  let passedTests = 0;
  let totalTests = invalidPasswordTests.length + 1; // +1 for valid password test

  // Test invalid passwords - these should all FAIL and NOT be saved
  for (const test of invalidPasswordTests) {
    console.log(`Test ${testNumber}: ${test.name}`);
    console.log(`Password: "${test.password}"`);
    
    try {
      const userData = {
        username: `testuser${testNumber}_${Date.now()}`,
        password: test.password,
        name: 'Test User',
        email: `test${testNumber}@example.com`
      };

      const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
      
      // If we get here, the registration succeeded when it should have failed
      console.log('❌ FAILED: Invalid password was accepted and user was created!');
      console.log(`Response:`, response.data);
      
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.error;
        
        if (status === 400 && errorMessage.includes(test.expectedError)) {
          console.log('✅ PASSED: Invalid password correctly rejected');
          console.log(`Error message: "${errorMessage}"`);
          passedTests++;
        } else {
          console.log('❌ FAILED: Wrong error message or status code');
          console.log(`Expected error containing: "${test.expectedError}"`);
          console.log(`Got status: ${status}, error: "${errorMessage}"`);
        }
      } else {
        console.log('❌ FAILED: Network error or unexpected error');
        console.log(error.message);
      }
    }
    
    console.log('');
    testNumber++;
    await wait(100); // Small delay between tests
  }

  // Test valid password - this should SUCCEED and be saved
  console.log(`Test ${testNumber}: ${validPasswordTest.name}`);
  console.log(`Password: "${validPasswordTest.password}"`);
  
  try {
    const userData = {
      username: `validuser_${Date.now()}`,
      password: validPasswordTest.password,
      name: 'Valid User',
      email: `valid_${Date.now()}@example.com`
    };

    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    
    if (response.status === 201 && response.data.success && response.data.user) {
      console.log('✅ PASSED: Valid password correctly accepted and user created');
      console.log(`Created user: ${response.data.user.username}`);
      passedTests++;
    } else {
      console.log('❌ FAILED: Valid password was rejected');
      console.log(`Response:`, response.data);
    }
    
  } catch (error) {
    console.log('❌ FAILED: Valid password was rejected');
    if (error.response) {
      console.log(`Status: ${error.response.status}, Error: "${error.response.data.error}"`);
    } else {
      console.log(error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Password validation is working correctly.');
    console.log('   - Invalid passwords are rejected and NOT saved to database');
    console.log('   - Valid passwords are accepted and users are created');
  } else {
    console.log('❌ SOME TESTS FAILED! Password validation needs attention.');
  }
  
  return passedTests === totalTests;
}

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

async function main() {
  console.log('Password Validation Test Suite');
  console.log('=============================\n');
  
  // Check if server is running
  const serverHealthy = await checkServerHealth();
  if (!serverHealthy) {
    process.exit(1);
  }
  
  // Run the password validation tests
  const allTestsPassed = await testPasswordValidation();
  
  process.exit(allTestsPassed ? 0 : 1);
}

// Run the tests if this script is executed directly
main().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
