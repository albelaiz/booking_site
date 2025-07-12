#!/usr/bin/env node
// Test property submission flow

const API_BASE = 'http://localhost:5000/api';

async function testPropertySubmission() {
  try {
    console.log('🧪 Testing Property Submission Flow...\n');

    // Test 1: Submit a property as host
    console.log('📝 Step 1: Submitting property as host...');
    
    const propertyData = {
      title: 'Test Property - Beautiful Villa',
      description: 'A stunning villa with amazing views',
      price: '250',
      bedrooms: 3,
      bathrooms: 2,
      capacity: 6,
      location: 'Marrakech, Morocco',
      amenities: ['WiFi', 'Pool', 'Kitchen'],
      images: ['https://example.com/image1.jpg'],
      rules: 'No smoking, No pets'
    };

    const submitResponse = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
        'x-user-id': '2', // Host user ID
        'x-user-role': 'host'
      },
      body: JSON.stringify(propertyData)
    });

    if (submitResponse.ok) {
      const submitResult = await submitResponse.json();
      console.log('✅ Property submitted successfully!');
      console.log('   Property ID:', submitResult.property?.id);
      console.log('   Status:', submitResult.property?.status);
      console.log('   Admin notifications sent to:', submitResult.adminUsers?.length || 0, 'admins');
      
      // Test 2: Check pending properties as admin
      console.log('\n📋 Step 2: Checking pending properties as admin...');
      
      const pendingResponse = await fetch(`${API_BASE}/admin/properties/pending`, {
        headers: {
          'Authorization': 'Bearer admin-token',
          'x-user-id': '1', // Admin user ID
          'x-user-role': 'admin'
        }
      });

      if (pendingResponse.ok) {
        const pendingResult = await pendingResponse.json();
        console.log('✅ Pending properties fetched successfully!');
        console.log('   Total pending properties:', pendingResult.properties?.length || 0);
        
        if (pendingResult.properties?.length > 0) {
          console.log('   Latest property:', pendingResult.properties[0].title);
          console.log('   Host:', pendingResult.properties[0].host?.name);
        }
      } else {
        console.log('❌ Failed to fetch pending properties:', pendingResponse.status);
      }
      
    } else {
      const error = await submitResponse.text();
      console.log('❌ Property submission failed:', submitResponse.status);
      console.log('   Error:', error);
    }

    console.log('\n🎉 Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPropertySubmission();
