#!/usr/bin/env node

// Test script to verify property filtering logic
const BASE_URL = 'http://localhost:5000/api';

async function testPropertyFiltering() {
  console.log('🧪 Testing Property Filtering Logic...\n');

  try {
    // Test 1: Public API should only return approved properties
    console.log('📋 Test 1: Public properties endpoint');
    const publicResponse = await fetch(`${BASE_URL}/properties/public`);
    const publicProperties = await publicResponse.json();
    
    console.log(`  ✅ Public endpoint returned ${publicProperties.length} properties`);
    const allApproved = publicProperties.every(p => p.status === 'approved');
    console.log(`  ${allApproved ? '✅' : '❌'} All properties are approved: ${allApproved}`);
    
    // Test 2: Admin API should return all properties
    console.log('\n📋 Test 2: Admin properties endpoint');
    const adminResponse = await fetch(`${BASE_URL}/properties`);
    const adminProperties = await adminResponse.json();
    
    console.log(`  ✅ Admin endpoint returned ${adminProperties.length} properties`);
    const statusCounts = adminProperties.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    console.log(`  ✅ Status breakdown:`, statusCounts);
    
    // Test 3: Public access to rejected property should fail
    console.log('\n📋 Test 3: Public access to rejected property');
    const rejectedProperty = adminProperties.find(p => p.status === 'rejected');
    if (rejectedProperty) {
      const publicRejectedResponse = await fetch(`${BASE_URL}/properties/public/${rejectedProperty.id}`);
      const isNotFound = publicRejectedResponse.status === 404;
      console.log(`  ${isNotFound ? '✅' : '❌'} Rejected property not accessible via public API: ${isNotFound}`);
    } else {
      console.log('  ⚠️  No rejected properties found to test');
    }
    
    // Test 4: Admin access to rejected property should work
    console.log('\n📋 Test 4: Admin access to rejected property');
    if (rejectedProperty) {
      const adminRejectedResponse = await fetch(`${BASE_URL}/properties/${rejectedProperty.id}`);
      const isAccessible = adminRejectedResponse.status === 200;
      console.log(`  ${isAccessible ? '✅' : '❌'} Rejected property accessible via admin API: ${isAccessible}`);
    } else {
      console.log('  ⚠️  No rejected properties found to test');
    }
    
    console.log('\n🎉 Property filtering tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testPropertyFiltering();
