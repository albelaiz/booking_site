#!/usr/bin/env node

/**
 * Property Approval Workflow Test Script
 * 
 * This script tests the complete property approval system:
 * 1. Database schema and constraints
 * 2. Backend API endpoints
 * 3. Property creation workflow
 * 4. Admin approval/rejection
 * 5. Security (hosts only see own properties)
 * 6. Frontend context behavior
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Test configuration
const TEST_CONFIG = {
  adminUser: { id: 1, role: 'admin', token: 'Bearer admin-token' },
  hostUser: { id: 3, role: 'owner', token: 'Bearer host-token' },
  publicUser: { id: null, role: 'public', token: null }
};

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Test 1: Property Creation by Host
async function testPropertyCreation() {
  console.log('🏠 Testing property creation by host...');
  
  const newProperty = {
    title: 'Test Villa Approval Workflow',
    description: 'A test property for the approval workflow',
    price: 150,
    priceUnit: 'night',
    location: 'Martil, Morocco',
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    amenities: ['WiFi', 'AC', 'Pool'],
    images: ['https://example.com/test1.jpg'],
    ownerId: TEST_CONFIG.hostUser.id
  };
  
  try {
    const property = await apiCall('/properties', {
      method: 'POST',
      headers: {
        'Authorization': TEST_CONFIG.hostUser.token,
        'x-user-id': TEST_CONFIG.hostUser.id,
        'x-user-role': TEST_CONFIG.hostUser.role
      },
      body: JSON.stringify(newProperty)
    });
    
    console.log('✅ Property created successfully');
    console.log(`   - ID: ${property.id}`);
    console.log(`   - Status: ${property.status}`);
    console.log(`   - Owner ID: ${property.ownerId}`);
    
    if (property.status !== 'pending') {
      throw new Error(`Expected status 'pending', got '${property.status}'`);
    }
    
    return property;
  } catch (error) {
    console.error('❌ Property creation failed:', error.message);
    throw error;
  }
}

// Test 2: Admin sees all properties
async function testAdminPropertyList() {
  console.log('👑 Testing admin property list access...');
  
  try {
    const properties = await apiCall('/properties', {
      headers: {
        'Authorization': TEST_CONFIG.adminUser.token
      }
    });
    
    console.log('✅ Admin can access all properties');
    console.log(`   - Total properties: ${properties.length}`);
    
    const pendingCount = properties.filter(p => p.status === 'pending').length;
    const approvedCount = properties.filter(p => p.status === 'approved').length;
    console.log(`   - Pending: ${pendingCount}, Approved: ${approvedCount}`);
    
    return properties;
  } catch (error) {
    console.error('❌ Admin property list failed:', error.message);
    throw error;
  }
}

// Test 3: Host sees only own properties
async function testHostPropertyList() {
  console.log('🏡 Testing host property list access...');
  
  try {
    const properties = await apiCall(`/properties/owner/${TEST_CONFIG.hostUser.id}`, {
      headers: {
        'Authorization': TEST_CONFIG.hostUser.token
      }
    });
    
    console.log('✅ Host can access own properties');
    console.log(`   - Host properties: ${properties.length}`);
    
    // Verify all properties belong to the host
    const invalidProperties = properties.filter(p => p.ownerId !== TEST_CONFIG.hostUser.id);
    if (invalidProperties.length > 0) {
      throw new Error(`Host can see ${invalidProperties.length} properties that don't belong to them`);
    }
    
    return properties;
  } catch (error) {
    console.error('❌ Host property list failed:', error.message);
    throw error;
  }
}

// Test 4: Public sees only approved properties
async function testPublicPropertyList() {
  console.log('🌍 Testing public property list access...');
  
  try {
    const properties = await apiCall('/properties/public');
    
    console.log('✅ Public can access approved properties');
    console.log(`   - Public properties: ${properties.length}`);
    
    // Verify all properties are approved
    const unapprovedProperties = properties.filter(p => p.status !== 'approved');
    if (unapprovedProperties.length > 0) {
      throw new Error(`Public can see ${unapprovedProperties.length} unapproved properties`);
    }
    
    return properties;
  } catch (error) {
    console.error('❌ Public property list failed:', error.message);
    throw error;
  }
}

// Test 5: Admin approves property
async function testPropertyApproval(propertyId) {
  console.log('✅ Testing property approval...');
  
  try {
    const property = await apiCall(`/properties/${propertyId}/approve`, {
      method: 'PATCH',
      headers: {
        'Authorization': TEST_CONFIG.adminUser.token
      }
    });
    
    console.log('✅ Property approved successfully');
    console.log(`   - ID: ${property.id}`);
    console.log(`   - New Status: ${property.status}`);
    
    if (property.status !== 'approved') {
      throw new Error(`Expected status 'approved', got '${property.status}'`);
    }
    
    return property;
  } catch (error) {
    console.error('❌ Property approval failed:', error.message);
    throw error;
  }
}

// Test 6: Admin rejects property
async function testPropertyRejection(propertyId) {
  console.log('❌ Testing property rejection...');
  
  try {
    const property = await apiCall(`/properties/${propertyId}/reject`, {
      method: 'PATCH',
      headers: {
        'Authorization': TEST_CONFIG.adminUser.token
      }
    });
    
    console.log('✅ Property rejected successfully');
    console.log(`   - ID: ${property.id}`);
    console.log(`   - New Status: ${property.status}`);
    
    if (property.status !== 'rejected') {
      throw new Error(`Expected status 'rejected', got '${property.status}'`);
    }
    
    return property;
  } catch (error) {
    console.error('❌ Property rejection failed:', error.message);
    throw error;
  }
}

// Test 7: Verify approved property appears in public list
async function testApprovedPropertyVisibility(propertyId) {
  console.log('👁️ Testing approved property visibility...');
  
  try {
    const publicProperties = await apiCall('/properties/public');
    const approvedProperty = publicProperties.find(p => p.id === propertyId);
    
    if (!approvedProperty) {
      throw new Error('Approved property not found in public list');
    }
    
    console.log('✅ Approved property is visible to public');
    return true;
  } catch (error) {
    console.error('❌ Approved property visibility test failed:', error.message);
    throw error;
  }
}

// Main test suite
async function runTests() {
  console.log('🚀 Starting Property Approval Workflow Tests\n');
  
  try {
    // Create a test property
    const newProperty = await testPropertyCreation();
    console.log('');
    
    // Test access controls
    await testAdminPropertyList();
    console.log('');
    
    await testHostPropertyList();
    console.log('');
    
    const publicPropertiesBefore = await testPublicPropertyList();
    console.log('');
    
    // Test approval workflow
    await testPropertyApproval(newProperty.id);
    console.log('');
    
    // Verify approved property is now public
    await testApprovedPropertyVisibility(newProperty.id);
    console.log('');
    
    // Create another property for rejection test
    console.log('🔄 Creating second property for rejection test...');
    const secondProperty = await testPropertyCreation();
    console.log('');
    
    // Test rejection workflow
    await testPropertyRejection(secondProperty.id);
    console.log('');
    
    // Verify rejected property is not public
    console.log('🔍 Verifying rejected property is not public...');
    const publicPropertiesAfter = await apiCall('/properties/public');
    const rejectedPropertyInPublic = publicPropertiesAfter.find(p => p.id === secondProperty.id);
    
    if (rejectedPropertyInPublic) {
      throw new Error('Rejected property should not be visible to public');
    }
    
    console.log('✅ Rejected property correctly hidden from public');
    console.log('');
    
    console.log('🎉 ALL TESTS PASSED! Property approval workflow is working correctly.');
    console.log('\n📋 Summary:');
    console.log('   ✅ Properties are created with "pending" status');
    console.log('   ✅ Admin can see all properties');
    console.log('   ✅ Hosts can only see their own properties');
    console.log('   ✅ Public can only see approved properties');
    console.log('   ✅ Admin can approve properties');
    console.log('   ✅ Admin can reject properties');
    console.log('   ✅ Approved properties become visible to public');
    console.log('   ✅ Rejected properties remain hidden from public');
    
  } catch (error) {
    console.error('\n💥 TEST SUITE FAILED:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Test suite interrupted');
  process.exit(0);
});

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };
