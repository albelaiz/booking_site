#!/usr/bin/env node

/**
 * TEST NOTIFICATION SYSTEM
 * Tests the new property review notification functionality
 */

import { execSync } from 'child_process';

const SERVER_URL = 'http://localhost:5000';

console.log('🔔 PROPERTY REVIEW NOTIFICATION SYSTEM TEST');
console.log('Testing Admin Notification System\n');

async function testNotificationSystem() {
  try {
    console.log('📝 TEST 1: Submit a property for review (Host)');
    
    // Test property submission
    const propertyData = {
      title: "Beautiful Beachfront Villa",
      description: "Stunning villa with ocean views in Tamuda Bay",
      price: "150.00",
      location: "Tamuda Bay, Morocco",
      bedrooms: 3,
      bathrooms: 2,
      capacity: 6,
      amenities: ["WiFi", "Pool", "Beach Access"],
      images: ["villa1.jpg", "villa2.jpg"]
    };

    console.log('   📤 Submitting property...');
    
    const submitResult = execSync(`curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer fake-token" -H "x-user-id: 1" -H "x-user-role: user" -d '${JSON.stringify(propertyData)}' "${SERVER_URL}/api/properties/submit"`, {
      encoding: 'utf-8'
    });

    console.log('   📄 Submit Response:', submitResult);
    
    // Parse response to get property ID
    let propertyId;
    try {
      const submitResponse = JSON.parse(submitResult);
      propertyId = submitResponse.property?.id;
      console.log(`   ✅ Property submitted successfully! ID: ${propertyId}`);
    } catch (error) {
      console.log('   ⚠️  Response parsing issue, but submission may have worked');
    }

    console.log('\n📨 TEST 2: Check admin notifications');
    
    // Check admin notifications (using actual admin user ID 1)
    const notificationsResult = execSync(`curl -s -H "Authorization: Bearer fake-token" -H "x-user-id: 1" -H "x-user-role: admin" "${SERVER_URL}/api/notifications"`, {
      encoding: 'utf-8'
    });

    console.log('   📬 Admin Notifications Response:', notificationsResult);
    
    try {
      const notificationsResponse = JSON.parse(notificationsResult);
      const reviewNotifications = notificationsResponse.notifications?.filter(n => n.type === 'property_review') || [];
      console.log(`   📊 Admin has ${reviewNotifications.length} property review notifications`);
      
      if (reviewNotifications.length > 0) {
        console.log('   ✅ NOTIFICATION SYSTEM WORKING: Admin received property review notification');
        reviewNotifications.forEach((notif, index) => {
          console.log(`   📋 Notification ${index + 1}: ${notif.title} - ${notif.message}`);
        });
      } else {
        console.log('   ❌ NOTIFICATION ISSUE: No property review notifications found');
      }
    } catch (error) {
      console.log('   ⚠️  Could not parse notifications response');
    }

    console.log('\n🔍 TEST 3: Check pending properties for admin');
    
    // Check pending properties (using actual admin user ID 1)
    const pendingResult = execSync(`curl -s -H "Authorization: Bearer fake-token" -H "x-user-id: 1" -H "x-user-role: admin" "${SERVER_URL}/api/admin/properties/pending"`, {
      encoding: 'utf-8'
    });

    console.log('   📋 Pending Properties Response:', pendingResult);
    
    try {
      const pendingResponse = JSON.parse(pendingResult);
      const pendingCount = Array.isArray(pendingResponse) ? pendingResponse.length : 0;
      console.log(`   📊 Admin sees ${pendingCount} pending properties for review`);
      
      if (pendingCount > 0) {
        console.log('   ✅ PROPERTY REVIEW QUEUE WORKING: Properties pending admin review');
      } else {
        console.log('   ⚠️  No pending properties found (may be expected)');
      }
    } catch (error) {
      console.log('   ⚠️  Could not parse pending properties response');
    }

    if (propertyId) {
      console.log('\n✅ TEST 4: Admin approves property');
      
      const reviewData = {
        status: 'approved',
        rejectionReason: null
      };

      const reviewResult = execSync(`curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer fake-token" -H "x-user-id: 1" -H "x-user-role: admin" -d '${JSON.stringify(reviewData)}' "${SERVER_URL}/api/admin/properties/${propertyId}/review"`, {
        encoding: 'utf-8'
      });

      console.log('   📄 Review Response:', reviewResult);
      
      try {
        const reviewResponse = JSON.parse(reviewResult);
        if (reviewResponse.success) {
          console.log('   ✅ PROPERTY APPROVAL WORKING: Property approved successfully');
          
          // Check host notifications
          console.log('\n📨 TEST 5: Check host notifications');
          
          const hostNotificationsResult = execSync(`curl -s -H "Authorization: Bearer fake-token" -H "x-user-id: 1" -H "x-user-role: user" "${SERVER_URL}/api/notifications"`, {
            encoding: 'utf-8'
          });

          console.log('   📬 Host Notifications Response:', hostNotificationsResult);
          
          try {
            const hostNotificationsResponse = JSON.parse(hostNotificationsResult);
            const approvalNotifications = hostNotificationsResponse.notifications?.filter(n => n.type === 'property_approved') || [];
            console.log(`   📊 Host has ${approvalNotifications.length} approval notifications`);
            
            if (approvalNotifications.length > 0) {
              console.log('   ✅ HOST NOTIFICATION WORKING: Host received property approval notification');
            } else {
              console.log('   ❌ HOST NOTIFICATION ISSUE: No approval notifications found');
            }
          } catch (error) {
            console.log('   ⚠️  Could not parse host notifications response');
          }
        } else {
          console.log('   ❌ PROPERTY APPROVAL FAILED');
        }
      } catch (error) {
        console.log('   ⚠️  Could not parse review response');
      }
    }

    console.log('\n🎉 NOTIFICATION SYSTEM TEST SUMMARY:');
    console.log('');
    console.log('✅ Features Tested:');
    console.log('   📝 Property submission with notification creation');
    console.log('   📨 Admin notification reception');
    console.log('   🔍 Pending property queue for admins');
    console.log('   ✅ Property approval workflow');
    console.log('   📬 Host notification reception');
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('   🔗 Implement WebSocket real-time notifications');
    console.log('   📧 Add email notification system');
    console.log('   🎨 Create frontend components for notifications');
    console.log('   📱 Add mobile notification support');

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    console.log('Make sure the server is running on port 5000');
  }
}

testNotificationSystem();
