#!/usr/bin/env node

const API_BASE = 'https://tamudastay.com/api';

console.log('🔧 TESTING: Owner Dashboard Property Filter\n');

async function testOwnerDashboardFilter() {
  console.log('1. Testing owner-specific properties endpoint...');
  
  // Test for owner ID 3 (typical host user)
  const ownerId = '3';
  
  try {
    const response = await fetch(`${API_BASE}/properties/owner/${ownerId}`, {
      headers: {
        'Authorization': 'Bearer owner-3',
        'x-user-id': '3',
        'x-user-role': 'owner'
      }
    });
    
    if (response.ok) {
      const ownerProperties = await response.json();
      console.log(`✅ Owner ${ownerId} properties: ${ownerProperties.length} found`);
      
      ownerProperties.forEach((prop, index) => {
        console.log(`   ${index + 1}. ID: ${prop.id}, Title: "${prop.title}", Owner: ${prop.ownerId}, Status: ${prop.status}`);
      });
      
      // Check if all properties belong to the correct owner
      const invalidProperties = ownerProperties.filter(p => p.ownerId !== parseInt(ownerId));
      if (invalidProperties.length > 0) {
        console.log(`❌ PROBLEM: Found ${invalidProperties.length} properties not belonging to owner ${ownerId}`);
        invalidProperties.forEach(prop => {
          console.log(`   Wrong owner: ID: ${prop.id}, Title: "${prop.title}", Owner: ${prop.ownerId}`);
        });
      } else {
        console.log(`✅ CORRECT: All properties belong to owner ${ownerId}`);
      }
    } else {
      console.log(`❌ Owner properties request failed: ${response.status}`);
      const errorText = await response.text();
      console.log(`   Error: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Error testing owner properties:', error.message);
  }
  
  console.log('');
  
  // Compare with all properties (admin view)
  console.log('2. Testing all properties (admin view) for comparison...');
  
  try {
    const response = await fetch(`${API_BASE}/properties`, {
      headers: {
        'Authorization': 'Bearer admin-1',
        'x-user-id': '1',
        'x-user-role': 'admin'
      }
    });
    
    if (response.ok) {
      const allProperties = await response.json();
      console.log(`✅ Total properties in database: ${allProperties.length}`);
      
      // Group by owner
      const ownerGroups = allProperties.reduce((acc, prop) => {
        const owner = prop.ownerId || 'unknown';
        acc[owner] = (acc[owner] || 0) + 1;
        return acc;
      }, {});
      
      console.log('   Properties by owner:');
      Object.entries(ownerGroups).forEach(([owner, count]) => {
        console.log(`     Owner ${owner}: ${count} properties`);
      });
      
    } else {
      console.log(`❌ Admin properties request failed: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error testing admin properties:', error.message);
  }
  
  console.log('');
  
  // Test with different owner IDs
  console.log('3. Testing different owner IDs...');
  
  const testOwnerIds = ['1', '2', '3'];
  
  for (const testOwnerId of testOwnerIds) {
    try {
      const response = await fetch(`${API_BASE}/properties/owner/${testOwnerId}`, {
        headers: {
          'Authorization': 'Bearer owner-' + testOwnerId,
          'x-user-id': testOwnerId,
          'x-user-role': 'owner'
        }
      });
      
      if (response.ok) {
        const properties = await response.json();
        console.log(`   Owner ${testOwnerId}: ${properties.length} properties`);
        
        // Check if any properties belong to wrong owner
        const wrongOwner = properties.filter(p => p.ownerId !== parseInt(testOwnerId));
        if (wrongOwner.length > 0) {
          console.log(`     ❌ PROBLEM: ${wrongOwner.length} properties don't belong to owner ${testOwnerId}`);
        } else {
          console.log(`     ✅ CORRECT: All properties belong to owner ${testOwnerId}`);
        }
      } else {
        console.log(`   Owner ${testOwnerId}: Request failed (${response.status})`);
      }
    } catch (error) {
      console.log(`   Owner ${testOwnerId}: Error - ${error.message}`);
    }
  }
  
  console.log('');
  console.log('📋 SUMMARY:');
  console.log('✅ If owner-specific endpoints return correct properties: Backend is working');
  console.log('❌ If frontend still shows all properties: Frontend filtering issue');
  console.log('');
  console.log('🔧 POTENTIAL ISSUES:');
  console.log('1. Frontend not using owner-specific API endpoint');
  console.log('2. Frontend filtering logic incorrect');
  console.log('3. User role/ID not detected correctly');
  console.log('4. Properties context not refreshing after login');
}

testOwnerDashboardFilter();
