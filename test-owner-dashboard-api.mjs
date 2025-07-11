#!/usr/bin/env node

const API_BASE = 'http://localhost:3000/api';

async function testOwnerDashboardAPIs() {
  console.log('🔧 TESTING: Owner Dashboard API Endpoints\n');

  // Test 1: Test the current endpoint being used by OwnerDashboard
  console.log('1. Testing /api/properties/owner/:ownerId (currently used by OwnerDashboard)');
  try {
    const response = await fetch(`${API_BASE}/properties/owner/3`, {
      headers: {
        'Authorization': 'Bearer owner-3',
        'x-user-id': '3',
        'x-user-role': 'owner'
      }
    });

    if (response.ok) {
      const properties = await response.json();
      console.log(`✅ Current endpoint returned ${properties.length} properties for owner 3`);
      
      // Check if any belong to wrong owner
      const wrongOwner = properties.filter(p => p.ownerId !== 3);
      if (wrongOwner.length > 0) {
        console.log(`❌ PROBLEM: ${wrongOwner.length} properties belong to other owners`);
      } else {
        console.log(`✅ All properties correctly belong to owner 3`);
      }
    } else {
      console.log(`❌ Current endpoint failed: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error testing current endpoint:', error.message);
  }

  console.log('');

  // Test 2: Test the dedicated owner dashboard endpoint  
  console.log('2. Testing /api/owner/properties (dedicated owner dashboard endpoint)');
  try {
    const response = await fetch(`${API_BASE}/owner/properties`, {
      headers: {
        'Authorization': 'Bearer owner-3',
        'x-user-id': '3',
        'x-user-role': 'owner'
      }
    });

    if (response.ok) {
      const properties = await response.json();
      console.log(`✅ Dedicated endpoint returned ${properties.length} properties for owner 3`);
      
      // Check if any belong to wrong owner
      const wrongOwner = properties.filter(p => p.ownerId !== 3);
      if (wrongOwner.length > 0) {
        console.log(`❌ PROBLEM: ${wrongOwner.length} properties belong to other owners`);
      } else {
        console.log(`✅ All properties correctly belong to owner 3`);
      }
    } else {
      console.log(`❌ Dedicated endpoint failed: ${response.status}`);
      const errorText = await response.text();
      console.log(`   Error: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Error testing dedicated endpoint:', error.message);
  }

  console.log('');

  // Test 3: Test with different user ID to verify isolation
  console.log('3. Testing user isolation (owner 1 vs owner 3)');
  try {
    const response1 = await fetch(`${API_BASE}/owner/properties`, {
      headers: {
        'Authorization': 'Bearer owner-1',
        'x-user-id': '1',
        'x-user-role': 'owner'
      }
    });

    const response3 = await fetch(`${API_BASE}/owner/properties`, {
      headers: {
        'Authorization': 'Bearer owner-3',
        'x-user-id': '3',
        'x-user-role': 'owner'
      }
    });

    if (response1.ok && response3.ok) {
      const props1 = await response1.json();
      const props3 = await response3.json();
      
      console.log(`✅ Owner 1 sees ${props1.length} properties`);
      console.log(`✅ Owner 3 sees ${props3.length} properties`);
      
      // Cross-check: make sure owner 1 doesn't see owner 3's properties
      const owner1SeeingOwner3 = props1.filter(p => p.ownerId === 3);
      const owner3SeeingOwner1 = props3.filter(p => p.ownerId === 1);
      
      if (owner1SeeingOwner3.length > 0) {
        console.log(`❌ SECURITY BREACH: Owner 1 can see ${owner1SeeingOwner3.length} of Owner 3's properties`);
      } else {
        console.log(`✅ Security OK: Owner 1 cannot see Owner 3's properties`);
      }
      
      if (owner3SeeingOwner1.length > 0) {
        console.log(`❌ SECURITY BREACH: Owner 3 can see ${owner3SeeingOwner1.length} of Owner 1's properties`);
      } else {
        console.log(`✅ Security OK: Owner 3 cannot see Owner 1's properties`);
      }
    } else {
      console.log('❌ Failed to test user isolation');
    }
  } catch (error) {
    console.error('❌ Error testing user isolation:', error.message);
  }

  console.log('\n📋 SUMMARY:');
  console.log('- Both endpoints should return the same properties for the same owner');
  console.log('- Each owner should only see their own properties');
  console.log('- The dedicated /api/owner/properties endpoint is more secure');
  console.log('- OwnerDashboard should use getOwnerDashboardProperties() instead of getByOwner()');
}

// Wait for server to be ready
setTimeout(testOwnerDashboardAPIs, 2000);
