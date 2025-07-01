/**
 * Comprehensive Visitor Testing Script
 * Tests all major visitor-facing functionality
 */

const testResults = {
  homepage: false,
  navigation: false,
  search: false,
  properties: false,
  propertyDetails: false,
  booking: false,
  authentication: false,
  responsiveness: false,
  performance: false,
  accessibility: false
};

// Test Homepage Loading
async function testHomepage() {
  try {
    console.log('🏠 Testing Homepage...');
    
    const response = await fetch('http://localhost:5000');
    if (response.ok) {
      console.log('✅ Homepage loads successfully');
      testResults.homepage = true;
    } else {
      console.log('❌ Homepage failed to load');
    }
  } catch (error) {
    console.log('❌ Homepage error:', error.message);
  }
}

// Test API Endpoints
async function testAPIEndpoints() {
  console.log('🔌 Testing API Endpoints...');
  
  const endpoints = [
    '/api/health',
    '/api/properties',
    '/api/bookings',
    '/api/users'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`);
      if (response.ok) {
        console.log(`✅ ${endpoint} - Working`);
      } else {
        console.log(`⚠️  ${endpoint} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

// Test Authentication Flow
async function testAuthentication() {
  console.log('🔐 Testing Authentication...');
  
  try {
    // Test user registration
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testvisitor',
        email: 'visitor@test.com',
        password: 'TestPassword123!',
        name: 'Test Visitor',
        phone: '+1234567890'
      }),
    });

    if (registerResponse.ok || registerResponse.status === 409) {
      console.log('✅ Registration endpoint working');
      
      // Test user login
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testvisitor',
          password: 'TestPassword123!'
        }),
      });

      if (loginResponse.ok) {
        console.log('✅ Login endpoint working');
        testResults.authentication = true;
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log('❌ Registration failed');
    }
  } catch (error) {
    console.log('❌ Authentication error:', error.message);
  }
}

// Test Properties API
async function testProperties() {
  console.log('🏘️ Testing Properties...');
  
  try {
    const response = await fetch('http://localhost:5000/api/properties');
    if (response.ok) {
      const properties = await response.json();
      console.log(`✅ Found ${properties.length} properties`);
      testResults.properties = true;
      
      if (properties.length > 0) {
        console.log('✅ Properties data available');
        // Test individual property
        const firstProperty = properties[0];
        console.log(`📍 Sample property: ${firstProperty.title} in ${firstProperty.location}`);
      }
    } else {
      console.log('❌ Properties endpoint failed');
    }
  } catch (error) {
    console.log('❌ Properties error:', error.message);
  }
}

// Test Booking System
async function testBookingSystem() {
  console.log('📅 Testing Booking System...');
  
  try {
    const bookingsResponse = await fetch('http://localhost:5000/api/bookings');
    if (bookingsResponse.ok) {
      console.log('✅ Bookings endpoint accessible');
      testResults.booking = true;
    } else {
      console.log('❌ Bookings endpoint failed');
    }
  } catch (error) {
    console.log('❌ Booking system error:', error.message);
  }
}

// Performance Test
async function testPerformance() {
  console.log('⚡ Testing Performance...');
  
  const startTime = Date.now();
  try {
    const response = await fetch('http://localhost:5000');
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    if (loadTime < 2000) {
      console.log(`✅ Fast load time: ${loadTime}ms`);
      testResults.performance = true;
    } else {
      console.log(`⚠️  Slow load time: ${loadTime}ms`);
    }
  } catch (error) {
    console.log('❌ Performance test error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Running Comprehensive Visitor Tests...\n');
  
  await testHomepage();
  await testAPIEndpoints();
  await testAuthentication();
  await testProperties();
  await testBookingSystem();
  await testPerformance();
  
  console.log('\n📊 Test Results Summary:');
  console.log('='.repeat(40));
  
  Object.entries(testResults).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${test.padEnd(15)}: ${status}`);
  });
  
  const passedTests = Object.values(testResults).filter(result => result).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log('='.repeat(40));
  console.log(`Overall Score: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Website is working excellently.');
  } else if (passedTests >= totalTests * 0.8) {
    console.log('🔧 Most features working. Minor issues to fix.');
  } else {
    console.log('⚠️  Significant issues found. Needs attention.');
  }
}

// Add error handling
process.on('uncaughtException', (error) => {
  console.log('❌ Uncaught Exception:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Run the tests
runAllTests().catch(console.error);
