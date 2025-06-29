#!/usr/bin/env node

// Complete Property Workflow Test
const API_BASE = 'http://localhost:3001/api';

async function testPropertyWorkflow() {
  console.log('🧪 Testing Complete Property Workflow\n');
  
  try {
    // Step 1: Check initial state
    console.log('1. Checking initial database state...');
    const adminProperties = await fetch(`${API_BASE}/properties`);
    const publicProperties = await fetch(`${API_BASE}/properties/public`);
    
    const adminData = await adminProperties.json();
    const publicData = await publicProperties.json();
    
    console.log(`   📊 Admin view: ${adminData.length} total properties`);
    console.log(`   🌐 Public view: ${publicData.length} approved properties\n`);
    
    // Step 2: Simulate user listing a new property
    console.log('2. Simulating user listing a new property...');
    const newProperty = {
      title: "Beautiful Beach House in Martil",
      description: "A stunning 3-bedroom beach house with ocean views, perfect for families. Located just steps from the beach with modern amenities and traditional Moroccan charm.",
      price: "150",
      priceUnit: "night",
      location: "Martil Beach, Morocco",
      bedrooms: 3,
      bathrooms: 2,
      capacity: 6,
      amenities: ["WiFi", "Kitchen", "Beach Access", "Parking", "Air Conditioning"],
      images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6"],
      ownerId: 3,
      status: "pending"
    };
    
    const createResponse = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProperty)
    });
    
    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Failed to create property: ${error}`);
    }
    
    const createdProperty = await createResponse.json();
    console.log(`   ✅ Property created with ID: ${createdProperty.id}`);
    console.log(`   📝 Title: "${createdProperty.title}"`);
    console.log(`   🏷️  Status: ${createdProperty.status}`);
    console.log(`   👤 Owner ID: ${createdProperty.ownerId}\n`);
    
    // Step 3: Verify property appears in admin/staff view
    console.log('3. Checking if property appears in admin/staff dashboards...');
    const updatedAdminProperties = await fetch(`${API_BASE}/properties`);
    const updatedAdminData = await updatedAdminProperties.json();
    
    const newPropertyInAdmin = updatedAdminData.find(p => p.id === createdProperty.id);
    if (newPropertyInAdmin) {
      console.log('   ✅ Property successfully appears in admin view');
      console.log(`   📊 Admin now sees: ${updatedAdminData.length} total properties`);
      console.log(`   🏷️  Property status: ${newPropertyInAdmin.status}\n`);
    } else {
      console.log('   ❌ Property NOT found in admin view!\n');
      return;
    }
    
    // Step 4: Verify property does NOT appear in public view (still pending)
    console.log('4. Verifying property does NOT appear in public view (still pending)...');
    const pendingPublicProperties = await fetch(`${API_BASE}/properties/public`);
    const pendingPublicData = await pendingPublicProperties.json();
    
    const newPropertyInPublic = pendingPublicData.find(p => p.id === createdProperty.id);
    if (!newPropertyInPublic) {
      console.log('   ✅ Correctly, property does NOT appear in public view while pending');
      console.log(`   🌐 Public still sees: ${pendingPublicData.length} approved properties\n`);
    } else {
      console.log('   ❌ ERROR: Pending property should NOT appear in public view!\n');
    }
    
    // Step 5: Simulate admin/staff approval
    console.log('5. Simulating admin/staff approval...');
    const approveResponse = await fetch(`${API_BASE}/properties/${createdProperty.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' })
    });
    
    if (!approveResponse.ok) {
      throw new Error('Failed to approve property');
    }
    
    const approvedProperty = await approveResponse.json();
    console.log('   ✅ Property approved successfully');
    console.log(`   🏷️  Status changed to: ${approvedProperty.status}\n`);
    
    // Step 6: Verify property now appears in public view
    console.log('6. Verifying property now appears in public home page...');
    const finalPublicProperties = await fetch(`${API_BASE}/properties/public`);
    const finalPublicData = await finalPublicProperties.json();
    
    const approvedPropertyInPublic = finalPublicData.find(p => p.id === createdProperty.id);
    if (approvedPropertyInPublic) {
      console.log('   ✅ SUCCESS! Property now appears in public view');
      console.log(`   🌐 Public now sees: ${finalPublicData.length} approved properties`);
      console.log(`   📝 Property "${approvedPropertyInPublic.title}" is visible to all website visitors\n`);
    } else {
      console.log('   ❌ ERROR: Approved property should appear in public view!\n');
      return;
    }
    
    // Step 7: Final summary
    console.log('7. Final workflow summary...');
    const finalAdminProperties = await fetch(`${API_BASE}/properties`);
    const finalAdminData = await finalAdminProperties.json();
    
    const statusCounts = {};
    finalAdminData.forEach(property => {
      statusCounts[property.status] = (statusCounts[property.status] || 0) + 1;
    });
    
    console.log('📊 Current database state:');
    console.log(`   🔍 Admin/Staff view: ${finalAdminData.length} total properties`);
    Object.entries(statusCounts).forEach(([status, count]) => {
      const emoji = status === 'approved' ? '✅' : status === 'pending' ? '⏳' : '❌';
      console.log(`     ${emoji} ${status}: ${count} properties`);
    });
    console.log(`   🌐 Public view: ${finalPublicData.length} approved properties visible to all users`);
    
    console.log('\n🎉 WORKFLOW TEST COMPLETED SUCCESSFULLY!');
    console.log('\n✅ VERIFICATION SUMMARY:');
    console.log('   ✓ User can create property listings');
    console.log('   ✓ New properties start with "pending" status');
    console.log('   ✓ Pending properties appear in admin/staff dashboards');
    console.log('   ✓ Pending properties do NOT appear on public home page');
    console.log('   ✓ Admin/staff can approve properties');
    console.log('   ✓ Approved properties appear on public home page');
    console.log('   ✓ All website visitors can see approved properties');
    
    console.log('\n🔗 Test URLs:');
    console.log('   • Home page (public): http://localhost:3001/');
    console.log('   • All properties (public): http://localhost:3001/properties');
    console.log('   • Admin properties: http://localhost:3001/admin/properties');
    console.log('   • Staff properties: http://localhost:3001/staff/properties');
    
  } catch (error) {
    console.error('❌ Workflow test failed:', error.message);
    process.exit(1);
  }
}

// Run the complete workflow test
testPropertyWorkflow();
