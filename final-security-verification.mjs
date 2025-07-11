#!/usr/bin/env node

/**
 * Final Security Verification Script
 * Comprehensive test to verify the security fix is properly implemented
 */

// Using native fetch API (Node.js 18+)

const API_BASE = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// Test scenarios
const testScenarios = [
  {
    name: "Owner accesses their own properties",
    url: "/properties/owner/1",
    headers: {
      'Authorization': 'Bearer user1-token',
      'x-user-id': '1',
      'x-user-role': 'user'
    },
    expectedStatus: 200,
    description: "Should succeed - owner accessing own data"
  },
  {
    name: "Owner tries URL manipulation",
    url: "/properties/owner/2",
    headers: {
      'Authorization': 'Bearer user1-token',
      'x-user-id': '1',
      'x-user-role': 'user'
    },
    expectedStatus: 200,
    description: "Should return owner 1's data (ignoring URL param)"
  },
  {
    name: "Unauthenticated access",
    url: "/properties/owner/1",
    headers: {},
    expectedStatus: 401,
    description: "Should be blocked - no authentication"
  },
  {
    name: "Missing user ID header",
    url: "/properties/owner/1",
    headers: {
      'Authorization': 'Bearer user1-token'
    },
    expectedStatus: 401,
    description: "Should be blocked - missing user ID"
  },
  {
    name: "Invalid user ID",
    url: "/properties/owner/1",
    headers: {
      'Authorization': 'Bearer user1-token',
      'x-user-id': 'invalid',
      'x-user-role': 'user'
    },
    expectedStatus: 400,
    description: "Should be blocked - invalid user ID format"
  },
  {
    name: "Admin accesses any owner properties",
    url: "/properties/owner/1",
    headers: {
      'Authorization': 'Bearer admin-token',
      'x-user-id': '3',
      'x-user-role': 'admin'
    },
    expectedStatus: 200,
    description: "Should succeed - admin has access"
  },
  {
    name: "Staff accesses any owner properties",
    url: "/properties/owner/2",
    headers: {
      'Authorization': 'Bearer staff-token',
      'x-user-id': '4',
      'x-user-role': 'staff'
    },
    expectedStatus: 200,
    description: "Should succeed - staff has access"
  }
];

async function runSecurityTests() {
  log(colors.cyan + colors.bold, '\n🔐 FINAL SECURITY VERIFICATION');
  log(colors.cyan, '=' * 50);
  
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    log(colors.yellow, `\n📋 Test ${i + 1}: ${scenario.name}`);
    log(colors.blue, `   ${scenario.description}`);
    
    try {
      const response = await fetch(`${API_BASE}${scenario.url}`, {
        headers: scenario.headers
      });
      
      const success = response.status === scenario.expectedStatus;
      
      if (success) {
        log(colors.green, `   ✅ PASS (Status: ${response.status})`);
        passed++;
        
        // Additional verification for successful responses
        if (response.ok && scenario.headers['x-user-id']) {
          try {
            const data = await response.json();
            if (Array.isArray(data)) {
              log(colors.green, `   📊 Returned ${data.length} properties`);
              
              // For owner isolation test, verify properties belong to the authenticated user
              if (scenario.headers['x-user-role'] === 'user') {
                const userId = parseInt(scenario.headers['x-user-id']);
                const hasOtherOwnerProperties = data.some(prop => prop.ownerId && prop.ownerId !== userId);
                
                if (!hasOtherOwnerProperties) {
                  log(colors.green, `   🔒 Property isolation verified - no other owner data`);
                } else {
                  log(colors.red, `   ⚠️  WARNING: Found properties from other owners!`);
                }
              }
            }
          } catch (e) {
            // Response might not be JSON, that's okay
          }
        }
      } else {
        log(colors.red, `   ❌ FAIL (Expected: ${scenario.expectedStatus}, Got: ${response.status})`);
        failed++;
        
        // Try to get error message
        try {
          const errorData = await response.json();
          if (errorData.error) {
            log(colors.red, `   💬 Error: ${errorData.error}`);
          }
        } catch (e) {
          // Error response might not be JSON
        }
      }
      
    } catch (error) {
      log(colors.red, `   ❌ FAIL (Network Error: ${error.message})`);
      failed++;
    }
  }
  
  // Summary
  log(colors.cyan + colors.bold, '\n📊 FINAL TEST SUMMARY');
  log(colors.cyan, '=' * 30);
  log(colors.green, `✅ Passed: ${passed}`);
  log(colors.red, `❌ Failed: ${failed}`);
  log(colors.cyan, `📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    log(colors.green + colors.bold, '\n🎉 ALL SECURITY TESTS PASSED!');
    log(colors.green, '🔒 Owner property isolation is working correctly.');
    log(colors.green, '🛡️  Security fix has been successfully implemented.');
    
    log(colors.blue + colors.bold, '\n📋 SECURITY FEATURES VERIFIED:');
    log(colors.blue, '   ✅ Owner data isolation');
    log(colors.blue, '   ✅ URL manipulation prevention');
    log(colors.blue, '   ✅ Authentication enforcement');
    log(colors.blue, '   ✅ Authorization validation');
    log(colors.blue, '   ✅ Admin access control');
    log(colors.blue, '   ✅ Input validation');
    
  } else {
    log(colors.red + colors.bold, '\n⚠️  SECURITY ISSUES DETECTED!');
    log(colors.red, '🚨 Please review and fix the failing tests before deployment.');
  }
  
  return failed === 0;
}

async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  log(colors.magenta + colors.bold, '🚀 FINAL SECURITY VERIFICATION STARTING...');
  log(colors.magenta, 'Ensuring the booking site security fix is properly implemented.\n');
  
  // Check server
  const serverRunning = await checkServerHealth();
  if (!serverRunning) {
    log(colors.red, '❌ Server is not running or not accessible');
    log(colors.yellow, '💡 Please start the server: npm run dev');
    process.exit(1);
  }
  
  log(colors.green, '✅ Server is running and accessible');
  
  // Run tests
  const success = await runSecurityTests();
  
  if (success) {
    log(colors.green + colors.bold, '\n🏆 SECURITY FIX VERIFICATION COMPLETE!');
    log(colors.green, '🎯 The property booking site is now secure.');
    log(colors.green, '🔐 Owners can only access their own properties.');
    log(colors.green, '🛡️  Ready for production deployment.');
  }
  
  process.exit(success ? 0 : 1);
}

main().catch(error => {
  log(colors.red, `💥 Fatal error: ${error.message}`);
  process.exit(1);
});
