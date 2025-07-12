
#!/usr/bin/env node

/**
 * Test Script: Owner Dashboard Security Fix Verification
 * 
 * This test verifies that hosts can only see their own properties
 * and cannot access other hosts' properties.
 */

import { execSync } from 'child_process';

const SERVER_URL = 'http://localhost:5000';

console.log('🔒 Testing Owner Dashboard Security Fix...\n');

// Test scenarios
const testCases = [
  {
    name: "Owner 1 accessing their own properties",
    userId: "1",
    ownerId: "1", 
    userRole: "user",
    shouldSucceed: true
  },
  {
    name: "Owner 1 trying to access Owner 3's properties",
    userId: "1",
    ownerId: "3",
    userRole: "user", 
    shouldSucceed: false
  },
  {
    name: "Admin accessing any owner's properties",
    userId: "2",
    ownerId: "3",
    userRole: "admin",
    shouldSucceed: true
  },
  {
    name: "Staff accessing any owner's properties", 
    userId: "4",
    ownerId: "1",
    userRole: "staff",
    shouldSucceed: true
  }
];

for (const testCase of testCases) {
  console.log(`📋 ${testCase.name}`);
  
  try {
    const result = execSync(`curl -s -w "HTTP_STATUS:%{http_code}" -H "Authorization: Bearer fake-token" -H "x-user-id: ${testCase.userId}" -H "x-user-role: ${testCase.userRole}" "${SERVER_URL}/api/properties/owner/${testCase.ownerId}"`, {
      encoding: 'utf-8',
      timeout: 5000
    });
    
    const [responseBody, statusCode] = result.split('HTTP_STATUS:');
    const httpStatus = parseInt(statusCode);
    
    if (testCase.shouldSucceed) {
      if (httpStatus === 200) {
        const properties = JSON.parse(responseBody);
        console.log(`   ✅ SUCCESS: Got ${properties.length} properties`);
        
        // Verify all properties belong to the correct owner
        const wrongOwner = properties.filter(p => p.ownerId !== parseInt(testCase.ownerId));
        if (wrongOwner.length > 0) {
          console.log(`   ❌ SECURITY ISSUE: Found ${wrongOwner.length} properties belonging to other owners!`);
        } else {
          console.log(`   ✅ SECURITY VERIFIED: All properties belong to owner ${testCase.ownerId}`);
        }
      } else {
        console.log(`   ❌ UNEXPECTED: Expected success but got HTTP ${httpStatus}`);
      }
    } else {
      if (httpStatus === 403) {
        console.log(`   ✅ SECURITY WORKING: Access properly denied (HTTP 403)`);
      } else if (httpStatus === 200) {
        console.log(`   ❌ SECURITY BREACH: Should have been denied but got HTTP 200!`);
      } else {
        console.log(`   ⚠️  UNEXPECTED: Got HTTP ${httpStatus}, expected 403`);
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Test failed: ${error.message}`);
  }
  
  console.log('');
}

console.log('🎯 Security Test Complete!\n');
console.log('Expected Results:');
console.log('✅ Owners can access their own properties');
console.log('❌ Owners cannot access other owners\' properties'); 
console.log('✅ Admins can access any properties');
console.log('✅ Staff can access any properties');
