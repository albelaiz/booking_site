#!/usr/bin/env node

const API_BASE = 'https://tamudastay.com/api';

console.log('🔧 TESTING: Admin Property Creation Auto-Approval\n');

async function testAdminPropertyCreation() {
  console.log('1. Creating property as ADMIN user...');
  
  const adminProperty = {
    title: 'Admin Created Property ' + Date.now(),
    description: 'This property was created by admin and should be immediately visible to public',
    price: '250.00',
    priceUnit: 'night',
    location: 'Admin Test Location',
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    amenities: ['WiFi', 'AC', 'Pool', 'Parking'],
    images: ['https://example.com/admin-property.jpg']
  };
  
  let propertyId;
  
  try {
    const createResponse = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-1',
        'x-user-id': '1',
        'x-user-role': 'admin'
      },
      body: JSON.stringify(adminProperty)
    });
    
    if (createResponse.ok) {
      const createdProperty = await createResponse.json();
      propertyId = createdProperty.id;
      console.log(`✅ Property created by admin: ID=${propertyId}, Status=${createdProperty.status}`);
      
      if (createdProperty.status === 'approved') {
        console.log('✅ CORRECT: Admin-created property is automatically approved');
      } else {
        console.log('❌ PROBLEM: Admin-created property is not automatically approved');
      }
    } else {
      const error = await createResponse.text();
      console.log(`❌ Property creation failed: ${createResponse.status}`);
      console.log(`   Error: ${error}`);
      return;
    }
  } catch (error) {
    console.error('❌ Error creating property:', error.message);
    return;
  }
  
  console.log('');
  
  // Check if property is immediately visible in public list
  console.log('2. Checking if property is immediately visible to public...');
  try {
    const publicResponse = await fetch(`${API_BASE}/properties/public`);
    const publicProperties = await publicResponse.json();
    const isInPublic = publicProperties.some(p => p.id === propertyId);
    
    if (isInPublic) {
      console.log('✅ CORRECT: Admin-created property is immediately visible to public');
    } else {
      console.log('❌ PROBLEM: Admin-created property is NOT visible to public');
    }
  } catch (error) {
    console.error('❌ Error checking public properties:', error.message);
  }
  
  console.log('');
  
  // Compare with host-created property
  console.log('3. Creating property as HOST user for comparison...');
  
  const hostProperty = {
    title: 'Host Created Property ' + Date.now(),
    description: 'This property was created by host and should be pending',
    price: '150.00',
    priceUnit: 'night',
    location: 'Host Test Location',
    bedrooms: 2,
    bathrooms: 1,
    capacity: 4,
    amenities: ['WiFi', 'AC'],
    images: ['https://example.com/host-property.jpg']
  };
  
  let hostPropertyId;
  
  try {
    const createResponse = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer owner-3',
        'x-user-id': '3',
        'x-user-role': 'owner'
      },
      body: JSON.stringify(hostProperty)
    });
    
    if (createResponse.ok) {
      const createdProperty = await createResponse.json();
      hostPropertyId = createdProperty.id;
      console.log(`✅ Property created by host: ID=${hostPropertyId}, Status=${createdProperty.status}`);
      
      if (createdProperty.status === 'pending') {
        console.log('✅ CORRECT: Host-created property is pending approval');
      } else {
        console.log('❌ PROBLEM: Host-created property should be pending');
      }
    } else {
      const error = await createResponse.text();
      console.log(`❌ Host property creation failed: ${createResponse.status}`);
      console.log(`   Error: ${error}`);
    }
  } catch (error) {
    console.error('❌ Error creating host property:', error.message);
  }
  
  console.log('');
  
  // Check if host property is NOT in public list
  console.log('4. Verifying host property is NOT in public list...');
  try {
    const publicResponse = await fetch(`${API_BASE}/properties/public`);
    const publicProperties = await publicResponse.json();
    const isInPublic = publicProperties.some(p => p.id === hostPropertyId);
    
    if (!isInPublic) {
      console.log('✅ CORRECT: Host-created property is NOT visible to public (pending)');
    } else {
      console.log('❌ PROBLEM: Host-created property should NOT be visible to public');
    }
  } catch (error) {
    console.error('❌ Error checking public properties:', error.message);
  }
  
  console.log('');
  console.log('📋 SUMMARY:');
  console.log('Admin-created properties should be immediately visible to public');
  console.log('Host-created properties should require admin approval');
  console.log('');
  console.log('🎯 If both tests pass, the system is working correctly!');
}

testAdminPropertyCreation();
