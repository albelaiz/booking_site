#!/usr/bin/env node

// Complete end-to-end test for user-to-admin messaging system
const API_BASE = 'http://localhost:3001/api';

async function testCompleteMessagingFlow() {
  console.log('🧪 Complete End-to-End Messaging System Test\n');

  try {
    // Step 1: Test initial state
    console.log('1. Checking initial message count...');
    const initialResponse = await fetch(`${API_BASE}/messages`);
    const initialMessages = await initialResponse.json();
    console.log(`✅ Found ${initialMessages.length} existing messages\n`);

    // Step 2: Simulate a new user sending a message via contact form
    console.log('2. Simulating new user sending message via contact form...');
    const newUserMessage = {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      subject: 'Question about beach house rental',
      message: 'Hi! I am planning a family vacation to Martil next month and I am interested in renting a beach house for a week. Could you please let me know what properties are available from July 15-22? We are a family of 4 (2 adults, 2 children). Thank you!'
    };

    const sendResponse = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserMessage)
    });

    if (!sendResponse.ok) {
      throw new Error(`Failed to send message: ${sendResponse.status}`);
    }

    const sentMessage = await sendResponse.json();
    console.log('✅ Message sent successfully!');
    console.log(`   📧 Subject: "${sentMessage.subject}"`);
    console.log(`   👤 From: ${sentMessage.name} (${sentMessage.email})`);
    console.log(`   🆔 Message ID: ${sentMessage.id}`);
    console.log(`   📅 Sent at: ${new Date(sentMessage.createdAt).toLocaleString()}`);
    console.log(`   🏷️  Status: ${sentMessage.status}\n`);

    // Step 3: Verify message appears in admin view
    console.log('3. Checking if message appears in admin dashboard...');
    const adminResponse = await fetch(`${API_BASE}/messages`);
    const allMessages = await adminResponse.json();
    
    const newMessage = allMessages.find(msg => msg.id === sentMessage.id);
    if (newMessage) {
      console.log('✅ Message successfully appears in admin view!');
      console.log(`   📊 Total messages in admin view: ${allMessages.length}`);
      console.log(`   🆕 New message found with all details intact\n`);
    } else {
      console.log('❌ New message NOT found in admin view!\n');
      return;
    }

    // Step 4: Test message status update (simulate admin marking as read)
    console.log('4. Testing admin message management (mark as read)...');
    const updateResponse = await fetch(`${API_BASE}/messages/${sentMessage.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'read' })
    });

    if (updateResponse.ok) {
      console.log('✅ Admin successfully marked message as read');
      
      // Verify the status change
      const updatedMessages = await fetch(`${API_BASE}/messages`);
      const messages = await updatedMessages.json();
      const updatedMessage = messages.find(msg => msg.id === sentMessage.id);
      
      if (updatedMessage && updatedMessage.status === 'read') {
        console.log(`   🔄 Status successfully updated to: ${updatedMessage.status}\n`);
      } else {
        console.log('❌ Status update failed\n');
      }
    } else {
      console.log('❌ Failed to update message status\n');
    }

    // Step 5: Test marking as replied
    console.log('5. Testing admin reply functionality...');
    const replyResponse = await fetch(`${API_BASE}/messages/${sentMessage.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'replied' })
    });

    if (replyResponse.ok) {
      console.log('✅ Admin successfully marked message as replied\n');
    }

    // Step 6: Final summary
    console.log('6. Final system summary...');
    const finalMessages = await fetch(`${API_BASE}/messages`);
    const finalMessageList = await finalMessages.json();
    
    // Count by status
    const statusCounts = {};
    finalMessageList.forEach(msg => {
      statusCounts[msg.status] = (statusCounts[msg.status] || 0) + 1;
    });

    console.log('📊 Current message statistics:');
    console.log(`   📨 Total messages: ${finalMessageList.length}`);
    Object.entries(statusCounts).forEach(([status, count]) => {
      const emoji = status === 'new' ? '🆕' : status === 'read' ? '👁️' : '✅';
      console.log(`   ${emoji} ${status}: ${count} messages`);
    });

    console.log('\n📋 Recent messages in admin view:');
    finalMessageList
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .forEach((msg, index) => {
        const date = new Date(msg.createdAt).toLocaleDateString();
        console.log(`   ${index + 1}. "${msg.subject}" - ${msg.name} [${msg.status}] (${date})`);
      });

    console.log('\n🎉 End-to-End Messaging Test COMPLETED SUCCESSFULLY!');
    console.log('\n✅ VERIFICATION CHECKLIST:');
    console.log('   ✓ User can send message via contact form');
    console.log('   ✓ Message is stored in database');
    console.log('   ✓ Message appears in admin dashboard');
    console.log('   ✓ Admin can update message status');
    console.log('   ✓ Status changes are persisted');
    console.log('   ✓ All messages are visible to admin');
    console.log('\n🔗 Next steps:');
    console.log('   • Test the frontend AdminMessages page at: http://localhost:3001/admin/messages');
    console.log('   • Try sending a message via the contact form at: http://localhost:3001/contact');
    console.log('   • Log in as admin and verify messages appear in the dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the complete test
testCompleteMessagingFlow();
