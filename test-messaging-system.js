#!/usr/bin/env node

// Test script to verify message sending and admin visibility
const API_BASE = 'http://localhost:3001/api';

async function testMessaging() {
  console.log('🧪 Testing User-to-Admin Messaging System...\n');

  try {
    // Test 1: Create a test user message
    console.log('1. Sending a test message...');
    const messageData = {
      name: 'Test User',
      email: 'testuser@example.com',
      subject: 'Test Message from New User',
      message: 'This is a test message to verify the messaging system works correctly.'
    };

    const sendResponse = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData)
    });

    if (!sendResponse.ok) {
      const error = await sendResponse.text();
      throw new Error(`Failed to send message: ${sendResponse.status} - ${error}`);
    }

    const sentMessage = await sendResponse.json();
    console.log('✅ Message sent successfully!');
    console.log(`   Message ID: ${sentMessage.id}`);
    console.log(`   Status: ${sentMessage.status}`);
    console.log(`   Created: ${sentMessage.createdAt}\n`);

    // Test 2: Verify message appears in admin list
    console.log('2. Checking if message appears in admin view...');
    const adminResponse = await fetch(`${API_BASE}/messages`);
    
    if (!adminResponse.ok) {
      throw new Error(`Failed to get messages: ${adminResponse.status}`);
    }

    const allMessages = await adminResponse.json();
    console.log(`✅ Admin can see ${allMessages.length} total messages`);

    // Find our test message
    const testMessage = allMessages.find(msg => 
      msg.name === messageData.name && 
      msg.email === messageData.email && 
      msg.subject === messageData.subject
    );

    if (testMessage) {
      console.log('✅ Test message found in admin view!');
      console.log(`   Message ID: ${testMessage.id}`);
      console.log(`   From: ${testMessage.name} (${testMessage.email})`);
      console.log(`   Subject: ${testMessage.subject}`);
      console.log(`   Status: ${testMessage.status}`);
      console.log(`   Sent: ${testMessage.createdAt}\n`);
    } else {
      console.log('❌ Test message NOT found in admin view!');
    }

    // Test 3: Check message counts by status
    console.log('3. Message status breakdown:');
    const statusCounts = {};
    allMessages.forEach(msg => {
      statusCounts[msg.status] = (statusCounts[msg.status] || 0) + 1;
    });

    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} messages`);
    });

    console.log('\n🎉 Messaging test completed successfully!');
    
    // Show recent messages
    console.log('\n📧 Recent messages in admin view:');
    allMessages
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .forEach((msg, index) => {
        console.log(`   ${index + 1}. ${msg.subject} - ${msg.name} (${msg.status})`);
      });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testMessaging();
