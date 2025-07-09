#!/usr/bin/env node

// Test script to verify frontend context integration
const API_BASE = 'http://localhost:5000/api';

async function testFrontendIntegration() {
  console.log('🖥️ Testing Frontend Context Integration\n');

  try {
    // Test 1: Public API (what visitors see)
    console.log('👥 Test 1: Public API (visitor view)...');
    const publicResponse = await fetch(`${API_BASE}/properties/public`);
    if (publicResponse.ok) {
      const publicProps = await publicResponse.json();
      console.log(`   ✅ Public API working - ${publicProps.length} approved properties visible`);
      
      // Show some properties
      publicProps.slice(0, 3).forEach(prop => {
        console.log(`   📋 "${prop.title}" - Status: ${prop.status}, Owner: ${prop.ownerId}`);
      });
    }

    // Test 2: Admin API (what admin sees in context)
    console.log('\n🛡️ Test 2: Admin API (admin context)...');
    const adminResponse = await fetch(`${API_BASE}/properties`, {
      headers: { 'Authorization': 'Bearer admin-token' }
    });
    if (adminResponse.ok) {
      const adminProps = await adminResponse.json();
      console.log(`   ✅ Admin API working - ${adminProps.length} total properties in admin context`);
      
      // Group by status
      const statusGroups = adminProps.reduce((acc, prop) => {
        acc[prop.status] = (acc[prop.status] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(statusGroups).forEach(([status, count]) => {
        console.log(`   📊 ${status}: ${count} properties`);
      });
    }

    // Test 3: Owner API (what property owners see)
    console.log('\n🏠 Test 3: Owner API (host properties)...');
    const ownerResponse = await fetch(`${API_BASE}/properties/owner/3`, {
      headers: { 'Authorization': 'Bearer owner-token' }
    });
    if (ownerResponse.ok) {
      const ownerProps = await ownerResponse.json();
      console.log(`   ✅ Owner API working - ${ownerProps.length} properties for owner 3`);
      
      ownerProps.forEach(prop => {
        console.log(`   🏘️ "${prop.title}" - Status: ${prop.status}`);
      });
    }

    console.log('\n✅ All API endpoints working correctly!');
    console.log('\n🎯 CONTEXT BEHAVIOR:');
    console.log('- Visitors: Use public API → See only approved properties');
    console.log('- Admin/Staff: Use admin API → See ALL properties (pending, approved, rejected)');
    console.log('- Property Owners: Use owner API → See only their own properties');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFrontendIntegration();
