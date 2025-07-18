#!/usr/bin/env node

// Simple test script to check if the fallback storage is working
import { storage } from './server/storage.js';

async function testFallbackStorage() {
  console.log('Testing fallback storage functionality...\n');

  try {
    console.log('📋 Testing getApprovedProperties...');
    const properties = await storage.getApprovedProperties();
    console.log(`✅ Found ${properties.length} approved properties`);
    if (properties.length > 0) {
      console.log(`   First property: ${properties[0].title}`);
    }

    console.log('\n📋 Testing getAllBookings...');
    const bookings = await storage.getAllBookings();
    console.log(`✅ Found ${bookings.length} bookings`);

    console.log('\n📋 Testing getAllMessages...');
    const messages = await storage.getAllMessages();
    console.log(`✅ Found ${messages.length} messages`);

    console.log('\n📋 Testing getAllUsers...');
    const users = await storage.getAllUsers();
    console.log(`✅ Found ${users.length} users`);
    if (users.length > 0) {
      console.log(`   First user: ${users[0].name} (${users[0].role})`);
    }

    console.log('\n🎉 All tests passed! Fallback storage is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testFallbackStorage();
}
