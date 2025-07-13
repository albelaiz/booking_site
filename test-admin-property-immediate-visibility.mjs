
#!/usr/bin/env node

const API_BASE = 'http://localhost:5000/api';

async function testAdminPropertyCreationAndVisibility() {
  console.log('🧪 Testing Admin Property Creation and Immediate Visibility\n');
  
  // Step 1: Create property as admin
  console.log('1. Creating property as ADMIN...');
  
  const adminProperty = {
    title: 'Admin Auto-Visible Property ' + Date.now(),
    description: 'This property should be immediately visible to all visitors',
    price: '300.00',
    priceUnit: 'night',
    location: 'Admin Test Location',
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    amenities: ['WiFi', 'Pool', 'Parking'],
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6']
  };
  
  let createdProperty;
  
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
      createdProperty = await response.json();
      console.log(`✅ Property created: ID=${createdProperty.id}, Status=${createdProperty.status}`);
      
      if (createdProperty.status === 'approved') {
        console.log('✅ CORRECT: Admin property is auto-approved');
      } else {
        console.log('❌ PROBLEM: Admin property should be auto-approved but status is:', createdProperty.status);
        return;
      }
    } else {
      const error = await response.text();
      console.log('❌ Failed to create admin property:', response.status, error);
      return;
    }
  } catch (error) {
    console.log('❌ Error creating admin property:', error.message);
    return;
  }
  
  console.log('');
  
  // Step 2: Check if property is immediately visible to public
  console.log('2. Checking if property is immediately visible to public...');
  
  try {
    const publicResponse = await fetch(`${API_BASE}/properties/public`);
    
    if (publicResponse.ok) {
      const publicProperties = await publicResponse.json();
      const isVisible = publicProperties.find(p => p.id === createdProperty.id);
      
      if (isVisible) {
        console.log('✅ SUCCESS: Admin property is immediately visible to all visitors');
        console.log(`   Property "${isVisible.title}" found in public listings`);
        console.log(`   Total public properties: ${publicProperties.length}`);
      } else {
        console.log('❌ PROBLEM: Admin property is not visible to public');
        console.log(`   Property ID ${createdProperty.id} not found in public listings`);
      }
    } else {
      console.log('❌ Failed to fetch public properties');
    }
  } catch (error) {
    console.log('❌ Error checking public visibility:', error.message);
  }
  
  console.log('');
  console.log('📋 SUMMARY:');
  console.log('✅ When admin creates a property, it should:');
  console.log('   - Be created with status="approved"');
  console.log('   - Appear immediately in public property listings');
  console.log('   - Be visible to anyone visiting the website');
}

testAdminPropertyCreationAndVisibility();
#!/usr/bin/env node

const API_BASE = 'http://localhost:5000/api';

async function testAdminPropertyCreationAndVisibility() {
  console.log('🧪 Testing Admin Property Creation and Immediate Visibility\n');
  
  // Step 1: Create property as admin
  console.log('1. Creating property as ADMIN...');
  
  const adminProperty = {
    title: 'Admin Auto-Visible Property ' + Date.now(),
    description: 'This property should be immediately visible to all visitors',
    price: '300.00',
    priceUnit: 'night',
    location: 'Admin Test Location',
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    amenities: ['WiFi', 'Pool', 'Parking'],
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6']
  };
  
  let createdProperty;
  
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
      createdProperty = await response.json();
      console.log(`✅ Property created: ID=${createdProperty.id}, Status=${createdProperty.status}`);
      
      if (createdProperty.status === 'approved') {
        console.log('✅ CORRECT: Admin property is auto-approved');
      } else {
        console.log('❌ PROBLEM: Admin property should be auto-approved but status is:', createdProperty.status);
        return;
      }
    } else {
      const error = await response.text();
      console.log('❌ Failed to create admin property:', response.status, error);
      return;
    }
  } catch (error) {
    console.log('❌ Error creating admin property:', error.message);
    return;
  }
  
  console.log('');
  
  // Step 2: Check if property is immediately visible to public
  console.log('2. Checking if property is immediately visible to public...');
  
  try {
    const publicResponse = await fetch(`${API_BASE}/properties/public`);
    
    if (publicResponse.ok) {
      const publicProperties = await publicResponse.json();
      const isVisible = publicProperties.find(p => p.id === createdProperty.id);
      
      if (isVisible) {
        console.log('✅ SUCCESS: Admin property is immediately visible to all visitors');
        console.log(`   Property "${isVisible.title}" found in public listings`);
        console.log(`   Total public properties: ${publicProperties.length}`);
      } else {
        console.log('❌ PROBLEM: Admin property is not visible to public');
        console.log(`   Property ID ${createdProperty.id} not found in public listings`);
      }
    } else {
      console.log('❌ Failed to fetch public properties');
    }
  } catch (error) {
    console.log('❌ Error checking public visibility:', error.message);
  }
  
  console.log('');
  console.log('📋 SUMMARY:');
  console.log('✅ When admin creates a property, it should:');
  console.log('   - Be created with status="approved"');
  console.log('   - Appear immediately in public property listings');
  console.log('   - Be stored permanently in Neon database');
  console.log('   - Be visible to anyone visiting the website');
}

testAdminPropertyCreationAndVisibility();
