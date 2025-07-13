import { auditLogsApi } from './api';

interface CreateAuditLogParams {
  userId: number;
  action: string;
  entity: string;
  entityId?: number;
  oldValues?: any;
  newValues?: any;
  description?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Create an audit log entry for administrative actions
 */
export const createAuditLog = async (params: CreateAuditLogParams) => {
  try {
    const auditLogData = {
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      oldValues: params.oldValues ? JSON.stringify(params.oldValues) : undefined,
      newValues: params.newValues ? JSON.stringify(params.newValues) : undefined,
      description: params.description,
      severity: params.severity || 'info',
      ipAddress: await getClientIP(),
      userAgent: navigator.userAgent,
    };

    await auditLogsApi.create(auditLogData);
  } catch (error) {
    // Don't throw errors for audit logging - just log to console
    console.warn('Failed to create audit log:', error);
  }
};

/**
 * Get the client's IP address (best effort)
 */
const getClientIP = async (): Promise<string | undefined> => {
  try {
    // This is a simple approach - in production you might want to use a service
    // or have the server determine the IP
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return undefined;
  }
};

/**
 * Common audit log actions for consistency
 */
export const AUDIT_ACTIONS = {
  // User actions
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_PASSWORD_RESET: 'user_password_reset',
  USER_ROLE_CHANGE: 'user_role_change',
  
  // Property actions
  PROPERTY_CREATE: 'property_create',
  PROPERTY_UPDATE: 'property_update',
  PROPERTY_DELETE: 'property_delete',
  PROPERTY_APPROVE: 'property_approve',
  PROPERTY_REJECT: 'property_reject',
  PROPERTY_SUSPEND: 'property_suspend',
  
  // Booking actions
  BOOKING_CREATE: 'booking_create',
  BOOKING_UPDATE: 'booking_update',
  BOOKING_DELETE: 'booking_delete',
  BOOKING_APPROVE: 'booking_approve',
  BOOKING_CANCEL: 'booking_cancel',
  BOOKING_REFUND: 'booking_refund',
  
  // System actions
  SYSTEM_SETTINGS_UPDATE: 'system_settings_update',
  SYSTEM_MAINTENANCE: 'system_maintenance',
  SYSTEM_BACKUP: 'system_backup',
  
  // Message actions
  MESSAGE_CREATE: 'message_create',
  MESSAGE_UPDATE: 'message_update',
  MESSAGE_DELETE: 'message_delete',
} as const;

/**
 * Common entity types for consistency
 */
export const AUDIT_ENTITIES = {
  USER: 'user',
  PROPERTY: 'property',
  BOOKING: 'booking',
  MESSAGE: 'message',
  SYSTEM: 'system',
} as const;

/**
 * Severity levels
 */
export const AUDIT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
} as const;

/**
 * Helper functions for common audit log scenarios
 */
export const auditHelpers = {
  // User management
  userCreated: (adminUserId: number, newUser: any) => 
    createAuditLog({
      userId: adminUserId,
      action: AUDIT_ACTIONS.USER_CREATE,
      entity: AUDIT_ENTITIES.USER,
      entityId: newUser.id,
      newValues: newUser,
      description: `Created new user: ${newUser.name} (${newUser.email})`,
      severity: AUDIT_SEVERITY.INFO,
    }),

  userUpdated: (adminUserId: number, userId: number, oldData: any, newData: any) =>
    createAuditLog({
      userId: adminUserId,
      action: AUDIT_ACTIONS.USER_UPDATE,
      entity: AUDIT_ENTITIES.USER,
      entityId: userId,
      oldValues: oldData,
      newValues: newData,
      description: `Updated user: ${newData.name || oldData.name}`,
      severity: AUDIT_SEVERITY.INFO,
    }),

  userDeleted: (adminUserId: number, deletedUser: any) =>
    createAuditLog({
      userId: adminUserId,
      action: AUDIT_ACTIONS.USER_DELETE,
      entity: AUDIT_ENTITIES.USER,
      entityId: deletedUser.id,
      oldValues: deletedUser,
      description: `Deleted user: ${deletedUser.name} (${deletedUser.email})`,
      severity: AUDIT_SEVERITY.WARNING,
    }),

  // Property management
  propertyCreated: (userId: number, newProperty: any) =>
    createAuditLog({
      userId,
      action: AUDIT_ACTIONS.PROPERTY_CREATE,
      entity: AUDIT_ENTITIES.PROPERTY,
      entityId: newProperty.id,
      newValues: newProperty,
      description: `Created new property: ${newProperty.name}`,
      severity: AUDIT_SEVERITY.INFO,
    }),

  propertyUpdated: (userId: number, propertyId: number, oldData: any, newData: any) =>
    createAuditLog({
      userId,
      action: AUDIT_ACTIONS.PROPERTY_UPDATE,
      entity: AUDIT_ENTITIES.PROPERTY,
      entityId: propertyId,
      oldValues: oldData,
      newValues: newData,
      description: `Updated property: ${newData.name || oldData.name}`,
      severity: AUDIT_SEVERITY.INFO,
    }),

  propertyDeleted: (adminUserId: number, deletedProperty: any) =>
    createAuditLog({
      userId: adminUserId,
      action: AUDIT_ACTIONS.PROPERTY_DELETE,
      entity: AUDIT_ENTITIES.PROPERTY,
      entityId: deletedProperty.id,
      oldValues: deletedProperty,
      description: `Deleted property: ${deletedProperty.name}`,
      severity: AUDIT_SEVERITY.WARNING,
    }),

  // System actions
  systemSettingsUpdated: (adminUserId: number, oldSettings: any, newSettings: any) =>
    createAuditLog({
      userId: adminUserId,
      action: AUDIT_ACTIONS.SYSTEM_SETTINGS_UPDATE,
      entity: AUDIT_ENTITIES.SYSTEM,
      oldValues: oldSettings,
      newValues: newSettings,
      description: 'Updated system settings',
      severity: AUDIT_SEVERITY.INFO,
    }),

  // Login tracking
  userLoggedIn: (userId: number, userInfo: any) =>
    createAuditLog({
      userId,
      action: AUDIT_ACTIONS.USER_LOGIN,
      entity: AUDIT_ENTITIES.USER,
      entityId: userId,
      description: `User logged in: ${userInfo.name} (${userInfo.email})`,
      severity: AUDIT_SEVERITY.INFO,
    }),
};
