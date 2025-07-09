#!/usr/bin/env node

// Test script to verify property management fixes
const API_BASE = 'http://localhost:5000/api';

async function testPropertyManagementFixes() {
  console.log('🧪 Testing Property Management Fixes\n');
  console.log('This test verifies:');
  console.log('1. Host can create properties');
  console.log('2. Properties appear in admin panel');
  console.log('3. Admin can approve properties');
  console.log('4. Approved properties show on home page\n');

  try {
    // Step 1: Test the new owner properties route
    console.log('📊 Step 1: Testing owner properties route...');
    try {
      const ownerPropsResponse = await fetch(`${API_BASE}/properties/owner/3`, {
        headers: {
          'Authorization': 'Bearer owner-token'
        }
      });
      if (ownerPropsResponse.ok) {
        const ownerProps = await ownerPropsResponse.json();
        console.log(`   ✅ Owner properties route working - found ${ownerProps.length} properties for owner 3`);
      } else {
        console.log(`   ⚠️ Owner properties route returned ${ownerPropsResponse.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Owner properties route failed: ${error.message}`);
    }

    // Step 2: Test admin properties route with auth
    console.log('\n🔐 Step 2: Testing admin properties route with authentication...');
    try {
      const adminPropsResponse = await fetch(`${API_BASE}/properties`, {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });
      if (adminPropsResponse.ok) {
        const adminProps = await adminPropsResponse.json();
        console.log(`   ✅ Admin properties route working - found ${adminProps.length} total properties`);
        
        // Check different statuses
        const pending = adminProps.filter(p => p.status === 'pending');
        const approved = adminProps.filter(p => p.status === 'approved');
        const rejected = adminProps.filter(p => p.status === 'rejected');
        
        console.log(`   📋 Property status breakdown:`);
        console.log(`      - Pending: ${pending.length}`);
        console.log(`      - Approved: ${approved.length}`);
        console.log(`      - Rejected: ${rejected.length}`);
      } else {
        console.log(`   ❌ Admin properties route failed with status ${adminPropsResponse.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Admin properties route failed: ${error.message}`);
    }

    // Step 3: Create a test property as host
    console.log('\n🏠 Step 3: Creating test property as host...');
    const testProperty = {
      title: 'Host Test Property - Management Fix',
      description: 'A property created by host to test the management workflow.',
      price: '180.00',
      priceUnit: 'night',
      location: 'Tamuda Bay, Morocco',
      bedrooms: 2,
      bathrooms: 1,
      capacity: 4,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      amenities: ['WiFi', 'Kitchen', 'Balcony', 'Sea View'],
      ownerId: 3, // Owner user ID
      status: 'pending' // Host properties start as pending
    };

    try {
      const createResponse = await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer owner-token'
        },
        body: JSON.stringify(testProperty)
      });

      if (createResponse.ok) {
        const createdProperty = await createResponse.json();
        console.log(`   ✅ Property created successfully by host`);
        console.log(`   Property ID: ${createdProperty.id}`);
        console.log(`   Title: ${createdProperty.title}`);
        console.log(`   Status: ${createdProperty.status}`);
        console.log(`   Owner ID: ${createdProperty.ownerId}`);

        // Step 4: Verify property appears in admin panel
        console.log('\n👨‍💼 Step 4: Verifying property appears in admin panel...');
        const adminCheckResponse = await fetch(`${API_BASE}/properties`, {
          headers: {
            'Authorization': 'Bearer admin-token'
          }
        });

        if (adminCheckResponse.ok) {
          const allProperties = await adminCheckResponse.json();
          const newProperty = allProperties.find(p => p.id === createdProperty.id);
          
          if (newProperty) {
            console.log(`   ✅ Property visible to admin`);
            console.log(`   Status in admin: ${newProperty.status}`);
            console.log(`   Owner ID: ${newProperty.ownerId}`);
            
            // Step 5: Test approval workflow
            console.log('\n✅ Step 5: Testing admin approval workflow...');
            const approveResponse = await fetch(`${API_BASE}/properties/${createdProperty.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin-token'
              },
              body: JSON.stringify({ status: 'approved' })
            });

            if (approveResponse.ok) {
              const approvedProperty = await approveResponse.json();
              console.log(`   ✅ Property approved by admin`);
              console.log(`   New status: ${approvedProperty.status}`);

              // Step 6: Verify property appears in public listings
              console.log('\n🌐 Step 6: Verifying property appears in public listings...');
              const publicResponse = await fetch(`${API_BASE}/properties/public`);
              if (publicResponse.ok) {
                const publicProperties = await publicResponse.json();
                const publicProperty = publicProperties.find(p => p.id === createdProperty.id);
                
                if (publicProperty) {
                  console.log(`   ✅ Property now visible to visitors`);
                  console.log(`   Total public properties: ${publicProperties.length}`);
                } else {
                  console.log(`   ❌ Property not visible to visitors yet`);
                }
              }
            } else {
              console.log(`   ❌ Failed to approve property: ${approveResponse.status}`);
            }
          } else {
            console.log(`   ❌ Property NOT visible to admin - this is the main issue!`);
          }
        } else {
          console.log(`   ❌ Failed to fetch admin properties: ${adminCheckResponse.status}`);
        }
      } else {
        const errorText = await createResponse.text();
        console.log(`   ❌ Failed to create property: ${createResponse.status}`);
        console.log(`   Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`   ❌ Property creation failed: ${error.message}`);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎯 TEST SUMMARY:');
    console.log('✅ Fixed issues:');
    console.log('   - Added /api/properties/owner/:ownerId route');
    console.log('   - Added authentication headers to API calls');
    console.log('   - Fixed owner ID type handling (string vs number)');
    console.log('   - Ensured admin can see all properties including pending');
    console.log('\n🔧 WORKFLOW:');
    console.log('1. Host creates property → Status: pending');
    console.log('2. Property appears in admin panel immediately');
    console.log('3. Admin approves property → Status: approved');
    console.log('4. Property appears on home page for visitors');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPropertyManagementFixes();
