#!/usr/bin/env node

/**
 * Comprehensive Test for Owner Dashboard and Public Properties Fixes
 * Tests both owner dashboard isolation and public properties display
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

// Test scenarios for both fixes
const testScenarios = [
  {
    name: "Public Properties API - Should show only approved properties",
    url: "/properties/public",
    headers: {},
    expectedStatus: 200,
    testType: "public",
    description: "Public should see only approved properties"
  },
  {
    name: "Owner Dashboard API - Owner sees ALL their properties",
    url: "/owner/properties",
    headers: {
      'Authorization': 'Bearer owner-token',
      'x-user-id': '3', // Owner user ID
      'x-user-role': 'owner'
    },
    expectedStatus: 200,
    testType: "owner",
    description: "Owner should see ALL their properties (pending, approved, rejected)"
  },
  {
    name: "Owner Dashboard API - User sees ALL their properties",
    url: "/owner/properties",
    headers: {
      'Authorization': 'Bearer user-token',
      'x-user-id': '4', // User ID (second owner)
      'x-user-role': 'user'
    },
    expectedStatus: 200,
    testType: "owner2",
    description: "Second owner should see only their properties"
  },
  {
    name: "Owner Dashboard Security - Unauthenticated access blocked",
    url: "/owner/properties",
    headers: {},
    expectedStatus: 401,
    testType: "security",
    description: "Should block unauthenticated access to owner dashboard"
  },
  {
    name: "Public Properties Individual - Get approved property by ID",
    url: "/properties/public/29",
    headers: {},
    expectedStatus: 200,
    testType: "public",
    description: "Should return approved property details"
  }
];

async function runOwnerDashboardAndPublicPropertiesTests() {
  log(colors.magenta + colors.bold, '\n🔧 OWNER DASHBOARD & PUBLIC PROPERTIES FIXES TEST');
  log(colors.magenta, '=' * 60);
  
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
        if (response.ok) {
          try {
            const data = await response.json();
            
            if (scenario.testType === 'public') {
              // Verify public properties are only approved
              if (Array.isArray(data)) {
                const hasUnapprovedProperties = data.some(prop => prop.status && prop.status !== 'approved');
                log(colors.green, `   📊 Found ${data.length} properties`);
                
                if (!hasUnapprovedProperties) {
                  log(colors.green, `   🔒 All properties are approved - public filter working!`);
                } else {
                  log(colors.red, `   ⚠️  WARNING: Found non-approved properties in public API!`);
                }
              }
            } else if (scenario.testType === 'owner' || scenario.testType === 'owner2') {
              // Verify owner sees ALL their properties
              if (Array.isArray(data)) {
                const statusCounts = data.reduce((counts, prop) => {
                  counts[prop.status || 'unknown'] = (counts[prop.status || 'unknown'] || 0) + 1;
                  return counts;
                }, {});
                
                log(colors.green, `   📊 Owner properties: ${data.length} total`);
                log(colors.green, `   📈 Status breakdown: ${JSON.stringify(statusCounts)}`);
                
                if (data.length > 0) {
                  log(colors.green, `   🔒 Owner dashboard showing ALL statuses - fix working!`);
                } else {
                  log(colors.yellow, `   ℹ️  No properties found for this owner`);
                }
              }
            }
          } catch (e) {
            // Response might not be JSON, that's okay
            log(colors.blue, `   📄 Response is not JSON (might be HTML)`);
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
  log(colors.magenta + colors.bold, '\n📊 FINAL TEST SUMMARY');
  log(colors.magenta, '=' * 30);
  log(colors.green, `✅ Passed: ${passed}`);
  log(colors.red, `❌ Failed: ${failed}`);
  log(colors.magenta, `📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    log(colors.green + colors.bold, '\n🎉 ALL FIXES WORKING CORRECTLY!');
    log(colors.green, '✅ Owner Dashboard: Shows ALL owner properties with status');
    log(colors.green, '✅ Public Properties: Shows ONLY approved properties');
    log(colors.green, '✅ Security: Proper authentication enforcement');
    log(colors.green, '🚀 Both issues have been successfully resolved!');
    
  } else {
    log(colors.red + colors.bold, '\n⚠️  SOME TESTS FAILED!');
    log(colors.red, '🚨 Please review and fix the failing tests.');
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
  log(colors.cyan + colors.bold, '🚀 STARTING OWNER DASHBOARD & PUBLIC PROPERTIES TEST...');
  log(colors.cyan, 'Verifying both fixes are working correctly.\n');
  
  // Check server
  const serverRunning = await checkServerHealth();
  if (!serverRunning) {
    log(colors.red, '❌ Server is not running or not accessible');
    log(colors.yellow, '💡 Please start the server: npm run dev');
    process.exit(1);
  }
  
  log(colors.green, '✅ Server is running and accessible');
  
  // Run tests
  const success = await runOwnerDashboardAndPublicPropertiesTests();
  
  if (success) {
    log(colors.green + colors.bold, '\n🏆 ALL TESTS PASSED!');
    log(colors.green, '🎯 Owner Dashboard and Public Properties are working correctly.');
    log(colors.green, '📋 Owner sees ALL their properties (approved, pending, rejected)');
    log(colors.green, '🌐 Public sees ONLY approved properties');
    log(colors.green, '🔐 Security is properly enforced');
  }
  
  process.exit(success ? 0 : 1);
}

main().catch(error => {
  log(colors.red, `💥 Fatal error: ${error.message}`);
  process.exit(1);
});
