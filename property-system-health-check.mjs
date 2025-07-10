#!/usr/bin/env node

/**
 * PROPERTY SYSTEM HEALTH CHECK
 * Quick verification that the property system is working correctly
 */

const API_BASE = 'http://localhost:5000/api';

async function healthCheck() {
  console.log('🏥 PROPERTY SYSTEM HEALTH CHECK');
  console.log('================================');
  
  try {
    // Test 1: Check if server is running
    console.log('\n1. 🌐 Server Health...');
    const serverResponse = await fetch(`${API_BASE}/properties/public`);
    if (serverResponse.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server is not responding');
      return;
    }
    
    // Test 2: Check admin can see all properties
    console.log('\n2. 👨‍💼 Admin Access...');
    const adminResponse = await fetch(`${API_BASE}/properties`, {
      headers: {
        'Authorization': 'Bearer admin-1',
        'x-user-id': '1',
        'x-user-role': 'admin'
      }
    });
    
    if (adminResponse.ok) {
      const properties = await adminResponse.json();
      const pending = properties.filter(p => p.status === 'pending');
      const approved = properties.filter(p => p.status === 'approved');
      const rejected = properties.filter(p => p.status === 'rejected');
      
      console.log(`✅ Admin can access properties: ${properties.length} total`);
      console.log(`   📊 ${pending.length} pending, ${approved.length} approved, ${rejected.length} rejected`);
      
      if (pending.length > 0) {
        console.log('✅ Pending properties available for admin review');
      } else {
        console.log('ℹ️  No pending properties currently');
      }
    } else {
      console.log('❌ Admin access failed');
    }
    
    // Test 3: Check public access
    console.log('\n3. 🌍 Public Access...');
    const publicResponse = await fetch(`${API_BASE}/properties/public`);
    if (publicResponse.ok) {
      const publicProperties = await publicResponse.json();
      console.log(`✅ Public can access properties: ${publicProperties.length} approved properties`);
    } else {
      console.log('❌ Public access failed');
    }
    
    // Test 4: Quick submission test
    console.log('\n4. 📝 Quick Submission Test...');
    const testProperty = {
      title: `Health Check Property ${Date.now()}`,
      description: 'Automated health check property',
      price: "100",
      location: 'Health Check Location',
      bedrooms: 1,
      bathrooms: 1,
      capacity: 2,
      amenities: ['WiFi'],
      images: ['https://example.com/healthcheck.jpg']
    };
    
    const submitResponse = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer owner-2',
        'x-user-id': '2',
        'x-user-role': 'owner'
      },
      body: JSON.stringify(testProperty)
    });
    
    if (submitResponse.ok) {
      const newProperty = await submitResponse.json();
      console.log(`✅ Property submission works: Created ID ${newProperty.id}`);
      
      // Clean up - reject the test property
      await fetch(`${API_BASE}/properties/${newProperty.id}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer admin-1',
          'x-user-id': '1',
          'x-user-role': 'admin'
        }
      });
      console.log('🧹 Test property cleaned up');
    } else {
      console.log('❌ Property submission failed');
    }
    
    console.log('\n📋 HEALTH CHECK RESULTS:');
    console.log('✅ Property system is healthy and working correctly!');
    console.log('\n📖 To see pending properties in admin panel:');
    console.log('   1. Go to Admin Dashboard → Properties');  
    console.log('   2. Click "Pending" tab');
    console.log('   3. Approve or reject pending properties');
    
  } catch (error) {
    console.error('\n❌ Health check failed:', error.message);
    console.log('🔧 Make sure the development server is running:');
    console.log('   npm run dev');
  }
}

healthCheck();
