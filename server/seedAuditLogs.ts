import { storage } from "./storage";

async function seedAuditLogs() {
  console.log('🌱 Seeding audit logs...');

  const auditLogData = [
    {
      userId: 1, // Admin user
      action: 'property_approved',
      entity: 'property',
      entityId: 1,
      oldValues: JSON.stringify({ status: 'pending' }),
      newValues: JSON.stringify({ status: 'approved' }),
      description: 'Approved property "Luxury Riad in Martil" for public listing',
      severity: 'info',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    {
      userId: 1,
      action: 'property_featured',
      entity: 'property',
      entityId: 1,
      oldValues: JSON.stringify({ featured: false }),
      newValues: JSON.stringify({ featured: true }),
      description: 'Featured property "Luxury Riad in Martil" on home page',
      severity: 'info',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    {
      userId: 2, // Staff user
      action: 'property_rejected',
      entity: 'property',
      entityId: 2,
      oldValues: JSON.stringify({ status: 'pending' }),
      newValues: JSON.stringify({ status: 'rejected' }),
      description: 'Rejected property "Incomplete Listing" from public listing',
      severity: 'warning',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
    {
      userId: 1,
      action: 'user_created',
      entity: 'user',
      entityId: 5,
      newValues: JSON.stringify({ name: 'John Doe', role: 'user', username: 'johndoe' }),
      description: 'Created new user account for "John Doe" (johndoe)',
      severity: 'info',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    {
      userId: 3, // Owner user
      action: 'property_created',
      entity: 'property',
      entityId: 3,
      newValues: JSON.stringify({ title: 'Beach House Martil', location: 'Martil Beach', status: 'pending' }),
      description: 'Created new property "Beach House Martil" in Martil Beach',
      severity: 'info',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
    },
    {
      userId: 1,
      action: 'booking_confirmed',
      entity: 'booking',
      entityId: 1,
      oldValues: JSON.stringify({ status: 'pending' }),
      newValues: JSON.stringify({ status: 'confirmed' }),
      description: 'Confirmed booking #1 for Sarah Johnson',
      severity: 'info',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    {
      userId: 2,
      action: 'system_backup',
      entity: 'system',
      description: 'Automated system backup completed successfully',
      severity: 'info',
      ipAddress: 'server-internal',
      userAgent: 'System/Automated',
    },
    {
      userId: 1,
      action: 'user_login_failed',
      entity: 'user',
      entityId: 4,
      description: 'Failed login attempt for username "testuser"',
      severity: 'warning',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    },
    {
      userId: 1,
      action: 'property_unfeatured',
      entity: 'property',
      entityId: 2,
      oldValues: JSON.stringify({ featured: true }),
      newValues: JSON.stringify({ featured: false }),
      description: 'Removed property "Old Featured Property" from featured section',
      severity: 'info',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    {
      userId: 1,
      action: 'system_maintenance',
      entity: 'system',
      description: 'System maintenance window started',
      severity: 'warning',
      ipAddress: 'server-internal',
      userAgent: 'System/Automated',
    }
  ];

  try {
    for (const logData of auditLogData) {
      await storage.createAuditLog(logData);
    }
    console.log(`✅ Successfully seeded ${auditLogData.length} audit log entries`);
  } catch (error) {
    console.error('❌ Error seeding audit logs:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAuditLogs()
    .then(() => {
      console.log('🎉 Audit logs seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Audit logs seeding failed:', error);
      process.exit(1);
    });
}

export { seedAuditLogs };
