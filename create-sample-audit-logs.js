// Demo script to create sample audit logs for testing
const API_BASE_URL = 'http://localhost:5000/api';

// Sample audit log entries
const sampleAuditLogs = [
  {
    userId: 1,
    action: 'user_login',
    entity: 'user',
    entityId: 1,
    description: 'Admin user logged into the system',
    severity: 'info',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    userId: 1,
    action: 'user_create',
    entity: 'user',
    entityId: 5,
    newValues: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer'
    }),
    description: 'Created new customer user: John Doe',
    severity: 'info',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    userId: 1,
    action: 'property_approve',
    entity: 'property',
    entityId: 3,
    oldValues: JSON.stringify({ status: 'pending' }),
    newValues: JSON.stringify({ status: 'approved' }),
    description: 'Approved property listing: Beach Villa Deluxe',
    severity: 'info',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    userId: 2,
    action: 'booking_cancel',
    entity: 'booking',
    entityId: 12,
    oldValues: JSON.stringify({ status: 'confirmed' }),
    newValues: JSON.stringify({ status: 'cancelled' }),
    description: 'Staff member cancelled booking #12 due to maintenance',
    severity: 'warning',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  {
    userId: 1,
    action: 'user_delete',
    entity: 'user',
    entityId: 8,
    oldValues: JSON.stringify({
      name: 'Spam User',
      email: 'spam@fake.com',
      role: 'customer'
    }),
    description: 'Deleted spam user account: Spam User',
    severity: 'warning',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    userId: 1,
    action: 'system_settings_update',
    entity: 'system',
    oldValues: JSON.stringify({ maintenance_mode: false }),
    newValues: JSON.stringify({ maintenance_mode: true }),
    description: 'Enabled maintenance mode for system updates',
    severity: 'critical',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    userId: 3,
    action: 'property_update',
    entity: 'property',
    entityId: 7,
    oldValues: JSON.stringify({ price: 150, availability: true }),
    newValues: JSON.stringify({ price: 175, availability: true }),
    description: 'Host updated property pricing',
    severity: 'info',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  },
  {
    userId: 1,
    action: 'user_role_change',
    entity: 'user',
    entityId: 4,
    oldValues: JSON.stringify({ role: 'customer' }),
    newValues: JSON.stringify({ role: 'staff' }),
    description: 'Promoted user to staff role: Alice Johnson',
    severity: 'warning',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
];

async function createSampleAuditLogs() {
  console.log('Creating sample audit logs...');
  
  for (const auditLog of sampleAuditLogs) {
    try {
      const response = await fetch(`${API_BASE_URL}/audit-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditLog),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created audit log: ${auditLog.action} - ${auditLog.description}`);
      } else {
        console.error(`❌ Failed to create audit log: ${auditLog.action}`, await response.text());
      }
    } catch (error) {
      console.error(`❌ Error creating audit log: ${auditLog.action}`, error);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('✅ Sample audit logs creation completed!');
  console.log('🔗 Visit http://localhost:5173/admin/audit-logs to view the logs');
}

// Check if server is available before running
async function checkServerAndRun() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      await createSampleAuditLogs();
    } else {
      console.error('❌ Server is not responding. Please start the development server first.');
    }
  } catch (error) {
    console.error('❌ Cannot connect to server. Please start the development server first.');
    console.log('💡 Run: pnpm dev');
  }
}

// Run if this script is executed directly
if (typeof window === 'undefined') {
  // Running in Node.js - use built-in fetch (Node 18+)
  checkServerAndRun();
} else {
  // Running in browser
  checkServerAndRun();
}
