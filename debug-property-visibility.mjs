#!/usr/bin/env node

/**
 * DEBUG: Property Visibility Issue
 * 
 * This script investigates why properties aren't showing in admin dashboard
 */

const API_BASE = 'http://localhost:5000/api';

async function debugPropertyVisibility() {
  console.log('🔍 DEBUGGING: Property Visibility Issue\n');
  
  // Test 1: Check if properties exist in public endpoint
  console.log('1. Checking properties in public endpoint...');
  try {
    const response = await fetch(`${API_BASE}/properties/public`);
    const publicProperties = await response.json();
    console.log(`✅ Found ${publicProperties.length} properties in public endpoint`);
    
    if (publicProperties.length > 0) {
      console.log('   Sample property:', {
        id: publicProperties[0].id,
        title: publicProperties[0].title,
        status: publicProperties[0].status,
        ownerId: publicProperties[0].ownerId || publicProperties[0].owner_id
      });
    }
  } catch (error) {
    console.error('❌ Error fetching public properties:', error.message);
  }
  
  console.log('');
  
  // Test 2: Try admin endpoint without auth (should fail)
  console.log('2. Testing admin endpoint without authentication...');
  try {
    const response = await fetch(`${API_BASE}/properties`);
    if (response.status === 401) {
      console.log('✅ Admin endpoint correctly requires authentication (401)');
    } else {
      const adminProperties = await response.json();
      console.log(`⚠️  Admin endpoint returned ${adminProperties.length} properties without auth!`);
    }
  } catch (error) {
    console.error('❌ Error testing admin endpoint:', error.message);
  }
  
  console.log('');
  
  // Test 3: Try admin endpoint with mock auth
  console.log('3. Testing admin endpoint with mock authentication...');
  try {
    const response = await fetch(`${API_BASE}/properties`, {
      headers: {
        'Authorization': 'Bearer mock-admin-token'
      }
    });
    
    if (response.ok) {
      const adminProperties = await response.json();
      console.log(`✅ Admin endpoint returned ${adminProperties.length} properties with auth`);
      
      if (adminProperties.length > 0) {
        console.log('   Properties by status:');
        const statusCounts = adminProperties.reduce((acc, prop) => {
          acc[prop.status] = (acc[prop.status] || 0) + 1;
          return acc;
        }, {});
        Object.entries(statusCounts).forEach(([status, count]) => {
          console.log(`   - ${status}: ${count}`);
        });
        
        console.log('\n   Sample properties:');
        adminProperties.slice(0, 3).forEach(prop => {
          console.log(`   - ID: ${prop.id}, Title: "${prop.title}", Status: ${prop.status}, Owner: ${prop.ownerId || prop.owner_id}`);
        });
      }
    } else {
      console.log(`❌ Admin endpoint failed with status: ${response.status}`);
      const errorText = await response.text();
      console.log(`   Error: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Error testing admin endpoint with auth:', error.message);
  }
  
  console.log('');
  
  // Test 4: Test property creation endpoint
  console.log('4. Testing property creation...');
  const testProperty = {
    title: 'DEBUG Test Property',
    description: 'A test property for debugging',
    price: 100,
    priceUnit: 'night',
    location: 'Test Location',
    bedrooms: 2,
    bathrooms: 1,
    capacity: 4,
    amenities: ['WiFi'],
    images: [],
    ownerId: 3
  };
  
  try {
    const response = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-host-token',
        'x-user-id': '3',
        'x-user-role': 'owner'
      },
      body: JSON.stringify(testProperty)
    });
    
    if (response.ok) {
      const createdProperty = await response.json();
      console.log('✅ Property created successfully');
      console.log(`   ID: ${createdProperty.id}, Status: ${createdProperty.status}`);
      
      // Immediately check if it appears in admin endpoint
      console.log('\n   Checking if new property appears in admin endpoint...');
      const adminCheck = await fetch(`${API_BASE}/properties`, {
        headers: { 'Authorization': 'Bearer mock-admin-token' }
      });
      
      if (adminCheck.ok) {
        const allProperties = await adminCheck.json();
        const newProperty = allProperties.find(p => p.id === createdProperty.id);
        if (newProperty) {
          console.log('   ✅ New property appears in admin list');
        } else {
          console.log('   ❌ New property NOT found in admin list');
        }
      }
    } else {
      console.log(`❌ Property creation failed: ${response.status}`);
      const errorText = await response.text();
      console.log(`   Error: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Error creating test property:', error.message);
  }
  
  console.log('');
  
  // Test 5: Check owner endpoint
  console.log('5. Testing owner properties endpoint...');
  try {
    const response = await fetch(`${API_BASE}/properties/owner/3`, {
      headers: {
        'Authorization': 'Bearer mock-owner-token'
      }
    });
    
    if (response.ok) {
      const ownerProperties = await response.json();
      console.log(`✅ Owner endpoint returned ${ownerProperties.length} properties`);
      
      if (ownerProperties.length > 0) {
        ownerProperties.forEach(prop => {
          console.log(`   - ID: ${prop.id}, Title: "${prop.title}", Status: ${prop.status}`);
        });
      }
    } else {
      console.log(`❌ Owner endpoint failed: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error testing owner endpoint:', error.message);
  }
  
  console.log('');
  console.log('🔧 DIAGNOSIS:');
  console.log('1. Check if admin API client is sending authentication headers');
  console.log('2. Verify user role detection in frontend');
  console.log('3. Ensure properties are being saved with correct owner IDs');
  console.log('4. Check if admin dashboard is calling the right API endpoint');
}

// Use Node.js built-in fetch (available in Node 18+)
debugPropertyVisibility().catch(console.error);
