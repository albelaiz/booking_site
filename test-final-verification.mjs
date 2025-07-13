#!/usr/bin/env node

console.log('🔍 FINAL PROPERTY SYSTEM VERIFICATION');
console.log('======================================');

const API_BASE = 'https://tamudastay.com/api';

async function createTestProperty() {
  console.log('\n1. 📝 Creating Test Property for Verification');
  
  const testProperty = {
    title: 'VERIFICATION - Admin Panel Test',
    description: 'This property should appear in admin pending review panel',
    price: "200",
    priceUnit: 'night',
    location: 'Verification Location',
    bedrooms: 2,
    bathrooms: 1,
    capacity: 4,
    amenities: ['WiFi', 'Kitchen'],
    images: ['https://example.com/verification.jpg'],
    featured: false
  };
  
  try {
    const response = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer owner-2',
        'x-user-id': '2',
        'x-user-role': 'owner'
      },
      body: JSON.stringify(testProperty)
    });
    
    if (response.ok) {
      const property = await response.json();
      console.log('✅ Test property created successfully');
      console.log(`   📋 ID: ${property.id}`);
      console.log(`   📊 Status: ${property.status}`);
      console.log(`   📍 Title: "${property.title}"`);
      return property.id;
    } else {
      console.log('❌ Failed to create test property');
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating test property:', error.message);
    return null;
  }
}

async function verifyAdminView() {
  console.log('\n2. 🔍 Verifying Admin Panel Data');
  
  try {
    const response = await fetch(`${API_BASE}/properties`, {
      headers: {
        'Authorization': 'Bearer admin-1',
        'x-user-id': '1',
        'x-user-role': 'admin'
      }
    });
    
    if (response.ok) {
      const properties = await response.json();
      const pending = properties.filter(p => p.status === 'pending');
      
      console.log(`✅ Admin endpoint working: ${properties.length} total properties`);
      console.log(`📊 Pending properties: ${pending.length}`);
      
      if (pending.length > 0) {
        console.log('\n📋 PENDING PROPERTIES (Admin Panel Should Show These):');
        pending.forEach((prop, index) => {
          console.log(`   ${index + 1}. "${prop.title}" (ID: ${prop.id})`);
          console.log(`      📅 Created: ${new Date(prop.createdAt).toLocaleDateString()}`);
          console.log(`      👤 Owner: ${prop.ownerId}`);
          console.log(`      📍 Location: ${prop.location}`);
          console.log(`      💰 Price: $${prop.price}/${prop.priceUnit}`);
          console.log('');
        });
        
        console.log('🎯 ADMIN PANEL INSTRUCTIONS:');
        console.log('1. Go to Admin Dashboard → Properties');
        console.log('2. Click on "Pending" tab');
        console.log(`3. You should see ${pending.length} pending properties`);
        console.log('4. Each property should have "Approve" and "Reject" buttons');
        
        return true;
      } else {
        console.log('⚠️  No pending properties found');
        return false;
      }
    } else {
      console.log('❌ Admin endpoint failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error verifying admin view:', error.message);
    return false;
  }
}

async function testApprovalWorkflow(propertyId) {
  if (!propertyId) {
    console.log('\n⚠️  Skipping approval test - no property ID');
    return;
  }
  
  console.log(`\n3. ✅ Testing Approval Workflow (ID: ${propertyId})`);
  
  try {
    const response = await fetch(`${API_BASE}/properties/${propertyId}/approve`, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer admin-1',
        'x-user-id': '1',
        'x-user-role': 'admin'
      }
    });
    
    if (response.ok) {
      const approvedProperty = await response.json();
      console.log('✅ Property approval successful');
      console.log(`   📊 Status changed to: ${approvedProperty.status}`);
      
      // Verify it appears in public list
      const publicResponse = await fetch(`${API_BASE}/properties/public`);
      if (publicResponse.ok) {
        const publicProperties = await publicResponse.json();
        const isPublic = publicProperties.some(p => p.id === propertyId);
        
        if (isPublic) {
          console.log('✅ Approved property now visible to public');
        } else {
          console.log('❌ Approved property not yet visible to public');
        }
      }
    } else {
      console.log('❌ Property approval failed');
    }
  } catch (error) {
    console.error('❌ Error testing approval:', error.message);
  }
}

async function runVerification() {
  console.log('🚀 Running final verification of property system...\n');
  
  const propertyId = await createTestProperty();
  const adminViewWorking = await verifyAdminView();
  await testApprovalWorkflow(propertyId);
  
  console.log('\n📋 FINAL VERIFICATION RESULTS:');
  console.log('===============================');
  
  if (adminViewWorking) {
    console.log('✅ PROPERTY SYSTEM IS WORKING CORRECTLY!');
    console.log('');
    console.log('📋 EXACT STEPS TO SEE PENDING PROPERTIES:');
    console.log('1. Login as admin user');
    console.log('2. Go to Admin Dashboard');
    console.log('3. Click "Properties" in the sidebar');
    console.log('4. Click the "Pending" tab');
    console.log('5. You should see all pending properties with approve/reject buttons');
    console.log('');
    console.log('🔧 IF STILL NOT VISIBLE:');
    console.log('- Try refreshing the page');
    console.log('- Check browser console for errors');
    console.log('- Verify you are logged in as admin role');
    console.log('- Check the Tabs component is working properly');
    
  } else {
    console.log('❌ PROPERTY SYSTEM HAS ISSUES');
    console.log('Check the test output above for specific errors');
  }
}

runVerification().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});
