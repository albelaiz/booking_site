#!/usr/bin/env node

const API_BASE = 'http://localhost:5000/api';

console.log('🔧 TESTING: Admin vs Host Property Creation Status\n');

async function testPropertyCreationStatus() {
  console.log('1. Creating property as ADMIN user...');
  
  const adminProperty = {
    title: 'ADMIN Auto-Approved Property ' + Date.now(),
    description: 'This property was created by admin and should be auto-approved',
    price: '300.00',
    priceUnit: 'night',
    location: 'Admin Location',
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    amenities: ['WiFi', 'Pool', 'Gym'],
    images: ['https://example.com/admin.jpg']
  };
  
  try {
    const response = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-1',
        'x-user-id': '1',
        'x-user-role': 'admin'
      },
      body: JSON.stringify(adminProperty)
    });
    
    if (response.ok) {
      const property = await response.json();
      console.log(`✅ Admin property created: ID=${property.id}, Status=${property.status}, Owner=${property.ownerId}`);
      
      if (property.status === 'approved') {
        console.log('✅ CORRECT: Admin property is auto-approved');
      } else {
        console.log('❌ PROBLEM: Admin property should be auto-approved but is:', property.status);
      }
    } else {
      console.log('❌ Failed to create admin property:', response.status);
    }
  } catch (error) {
    console.log('❌ Error creating admin property:', error.message);
  }
  
  console.log('');
  
  console.log('2. Creating property as HOST user...');
  
  const hostProperty = {
    title: 'HOST Pending Property ' + Date.now(),
    description: 'This property was created by host and should be pending',
    price: '200.00',
    priceUnit: 'night',
    location: 'Host Location',
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    amenities: ['WiFi', 'AC'],
    images: ['https://example.com/host.jpg']
  };
  
  try {
    const response = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer owner-3',
        'x-user-id': '3',
        'x-user-role': 'owner'
      },
      body: JSON.stringify(hostProperty)
    });
    
    if (response.ok) {
      const property = await response.json();
      console.log(`✅ Host property created: ID=${property.id}, Status=${property.status}, Owner=${property.ownerId}`);
      
      if (property.status === 'pending') {
        console.log('✅ CORRECT: Host property is pending approval');
      } else {
        console.log('❌ PROBLEM: Host property should be pending but is:', property.status);
      }
    } else {
      console.log('❌ Failed to create host property:', response.status);
    }
  } catch (error) {
    console.log('❌ Error creating host property:', error.message);
  }
  
  console.log('');
  
  console.log('3. Checking public properties...');
  try {
    const response = await fetch(`${API_BASE}/properties/public`);
    const publicProperties = await response.json();
    console.log(`✅ Public properties count: ${publicProperties.length}`);
    
    // Show recent properties
    const recentProperties = publicProperties.slice(-3);
    console.log('Recent public properties:');
    recentProperties.forEach(prop => {
      console.log(`   - ID: ${prop.id}, Title: "${prop.title}", Status: ${prop.status}`);
    });
  } catch (error) {
    console.log('❌ Error fetching public properties:', error.message);
  }
  
  console.log('');
  
  console.log('4. Checking all properties (admin view)...');
  try {
    const response = await fetch(`${API_BASE}/properties`, {
      headers: {
        'Authorization': 'Bearer admin-1',
        'x-user-id': '1',
        'x-user-role': 'admin'
      }
    });
    
    const allProperties = await response.json();
    console.log(`✅ Total properties: ${allProperties.length}`);
    
    const statusCounts = allProperties.reduce((acc, prop) => {
      acc[prop.status] = (acc[prop.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Properties by status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count}`);
    });
    
    // Show recent properties
    const recentProperties = allProperties.slice(-3);
    console.log('Recent properties (all):');
    recentProperties.forEach(prop => {
      console.log(`   - ID: ${prop.id}, Title: "${prop.title}", Status: ${prop.status}, Owner: ${prop.ownerId}`);
    });
  } catch (error) {
    console.log('❌ Error fetching all properties:', error.message);
  }
  
  console.log('');
  console.log('📋 SUMMARY:');
  console.log('✅ Admin-created properties should be status="approved" and visible to public');
  console.log('✅ Host-created properties should be status="pending" and NOT visible to public');
  console.log('✅ This ensures admins can add properties that are immediately live');
}

testPropertyCreationStatus();
