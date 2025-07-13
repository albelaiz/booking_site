#!/usr/bin/env node

console.log('🧪 TESTING FRONTEND PROPERTY WORKFLOW');
console.log('=====================================');

const API_BASE = 'https://tamudastay.com/api';

async function testCompleteWorkflow() {
  console.log('\n1. 🏠 Simulating Property Form Submission (Frontend Pattern)');
  
  // This simulates what the PropertyForm.tsx actually sends
  const propertyFormData = {
    title: 'Frontend Test Property',
    description: 'Testing the exact frontend submission pattern',
    price: "175", // String, as now fixed in PropertyForm
    priceUnit: 'night',
    location: 'Frontend Test Location',
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    amenities: ['WiFi', 'Kitchen', 'Air conditioning'],
    images: ['https://example.com/frontend-test.jpg'],
    featured: false
  };

  try {
    // This simulates the API call from propertiesApi.create()
    const response = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer owner-3', // Simulating logged-in owner
        'x-user-id': '3',
        'x-user-role': 'owner'
      },
      body: JSON.stringify(propertyFormData)
    });
    
    if (response.ok) {
      const createdProperty = await response.json();
      console.log('✅ Property form submission successful');
      console.log(`   📋 Property ID: ${createdProperty.id}`);
      console.log(`   📊 Status: ${createdProperty.status}`);
      console.log(`   👤 Owner ID: ${createdProperty.ownerId}`);
      
      return createdProperty.id;
    } else {
      const error = await response.text();
      console.log(`❌ Property form submission failed: ${response.status}`);
      console.log(`   Error: ${error}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error in property form submission:', error.message);
    return null;
  }
}

async function testAdminDashboardView() {
  console.log('\n2. 👨‍💼 Testing Admin Dashboard View (PropertiesContext)');
  
  try {
    // This simulates what the AdminProperties page calls via useProperties()
    const response = await fetch(`${API_BASE}/properties`, {
      headers: {
        'Authorization': 'Bearer admin-1',
        'x-user-id': '1', 
        'x-user-role': 'admin'
      }
    });
    
    if (response.ok) {
      const allProperties = await response.json();
      console.log(`✅ Admin can fetch properties: ${allProperties.length} total`);
      
      // Simulate the filtering that AdminProperties.tsx does
      const pendingProperties = allProperties.filter(p => p.status === 'pending');
      const approvedProperties = allProperties.filter(p => p.status === 'approved');
      const rejectedProperties = allProperties.filter(p => p.status === 'rejected');
      
      console.log(`   📊 Status breakdown:`);
      console.log(`      🟡 Pending: ${pendingProperties.length}`);
      console.log(`      🟢 Approved: ${approvedProperties.length}`);
      console.log(`      🔴 Rejected: ${rejectedProperties.length}`);
      
      if (pendingProperties.length > 0) {
        console.log(`   📋 Recent pending properties:`);
        pendingProperties.slice(-3).forEach(prop => {
          console.log(`      • "${prop.title}" (ID: ${prop.id}, Owner: ${prop.ownerId})`);
        });
        return true;
      } else {
        console.log('   ⚠️  No pending properties found in admin view');
        return false;
      }
    } else {
      const error = await response.text();
      console.log(`❌ Admin properties fetch failed: ${response.status} ${error}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing admin dashboard:', error.message);
    return false;
  }
}

async function testOwnerDashboardView() {
  console.log('\n3. 🏠 Testing Owner Dashboard View (Own Properties)');
  
  try {
    // This simulates what OwnerDashboard calls via propertiesApi.getByOwner()
    const response = await fetch(`${API_BASE}/properties/owner/3`, {
      headers: {
        'Authorization': 'Bearer owner-3',
        'x-user-id': '3',
        'x-user-role': 'owner'
      }
    });
    
    if (response.ok) {
      const ownerProperties = await response.json();
      console.log(`✅ Owner can fetch their properties: ${ownerProperties.length} total`);
      
      const pendingOwn = ownerProperties.filter(p => p.status === 'pending');
      const approvedOwn = ownerProperties.filter(p => p.status === 'approved');
      const rejectedOwn = ownerProperties.filter(p => p.status === 'rejected');
      
      console.log(`   📊 Owner's property status:`);
      console.log(`      🟡 Pending: ${pendingOwn.length}`);
      console.log(`      🟢 Approved: ${approvedOwn.length}`);
      console.log(`      🔴 Rejected: ${rejectedOwn.length}`);
      
      if (pendingOwn.length > 0) {
        console.log(`   📋 Owner's pending properties:`);
        pendingOwn.forEach(prop => {
          console.log(`      • "${prop.title}" (ID: ${prop.id})`);
        });
      }
      
      return true;
    } else {
      const error = await response.text();
      console.log(`❌ Owner properties fetch failed: ${response.status} ${error}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing owner dashboard:', error.message);
    return false;
  }
}

async function runWorkflowTest() {
  console.log('🚀 Starting complete frontend workflow test...\n');
  
  // Step 1: Submit property via form
  const propertyId = await testCompleteWorkflow();
  
  // Step 2: Check admin dashboard
  const adminCanSeePending = await testAdminDashboardView();
  
  // Step 3: Check owner dashboard  
  const ownerCanSeeOwn = await testOwnerDashboardView();
  
  console.log('\n📋 WORKFLOW TEST RESULTS:');
  console.log('==========================');
  
  if (propertyId) {
    console.log('✅ Property form submission works correctly');
  } else {
    console.log('❌ Property form submission failed');
  }
  
  if (adminCanSeePending) {
    console.log('✅ Admin dashboard shows pending properties');
  } else {
    console.log('❌ Admin dashboard missing pending properties');
  }
  
  if (ownerCanSeeOwn) {
    console.log('✅ Owner dashboard shows own properties');
  } else {
    console.log('❌ Owner dashboard missing own properties');
  }
  
  console.log('\n🎯 CONCLUSION:');
  if (propertyId && adminCanSeePending && ownerCanSeeOwn) {
    console.log('✅ The complete property workflow is working correctly!');
    console.log('   If users can\'t see pending properties in the admin panel,');
    console.log('   the issue might be in the frontend state management or refresh.');
  } else {
    console.log('❌ There are issues in the property workflow that need fixing.');
  }
}

// Run the workflow test
runWorkflowTest().catch(error => {
  console.error('Workflow test failed:', error);
  process.exit(1);
});
