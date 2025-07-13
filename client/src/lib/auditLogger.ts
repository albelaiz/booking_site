const API_BASE_URL = '/api';

export interface AuditLogData {
  userId: number;
  action: string;
  entity: string;
  entityId?: number;
  oldValues?: any;
  newValues?: any;
  description?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

export class AuditLogger {
  private static instance: AuditLogger;
  private enabled: boolean = true;

  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  public async logAction(data: AuditLogData): Promise<void> {
    if (!this.enabled) return;

    try {
      const auditLogData = {
        ...data,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        severity: data.severity || 'info',
        createdAt: new Date().toISOString(),
      };

      await fetch(`${API_BASE_URL}/audit-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditLogData),
      });
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  }

  public async logPropertyAction(action: string, property: any, userId: number, oldValues?: any): Promise<void> {
    const description = this.generatePropertyActionDescription(action, property);
    
    await this.logAction({
      userId,
      action,
      entity: 'property',
      entityId: parseInt(property.id),
      oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
      newValues: JSON.stringify(property),
      description,
      severity: this.getActionSeverity(action),
    });
  }

  public async logUserAction(action: string, user: any, userId: number, oldValues?: any): Promise<void> {
    const description = this.generateUserActionDescription(action, user);
    
    await this.logAction({
      userId,
      action,
      entity: 'user',
      entityId: parseInt(user.id),
      oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
      newValues: JSON.stringify(user),
      description,
      severity: this.getActionSeverity(action),
    });
  }

  public async logBookingAction(action: string, booking: any, userId: number, oldValues?: any): Promise<void> {
    const description = this.generateBookingActionDescription(action, booking);
    
    await this.logAction({
      userId,
      action,
      entity: 'booking',
      entityId: parseInt(booking.id),
      oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
      newValues: JSON.stringify(booking),
      description,
      severity: this.getActionSeverity(action),
    });
  }

  public async logSystemAction(action: string, description: string, userId: number, severity: 'info' | 'warning' | 'error' | 'critical' = 'info'): Promise<void> {
    await this.logAction({
      userId,
      action,
      entity: 'system',
      description,
      severity,
    });
  }

  private generatePropertyActionDescription(action: string, property: any): string {
    switch (action) {
      case 'property_created':
        return `Created new property "${property.title}" in ${property.location}`;
      case 'property_updated':
        return `Updated property "${property.title}" (ID: ${property.id})`;
      case 'property_deleted':
        return `Deleted property "${property.title}" (ID: ${property.id})`;
      case 'property_approved':
        return `Approved property "${property.title}" for public listing`;
      case 'property_rejected':
        return `Rejected property "${property.title}" from public listing`;
      case 'property_featured':
        return `Featured property "${property.title}" on home page`;
      case 'property_unfeatured':
        return `Removed property "${property.title}" from featured section`;
      case 'property_status_changed':
        return `Changed status of property "${property.title}" to ${property.status}`;
      default:
        return `${action} performed on property "${property.title}"`;
    }
  }

  private generateUserActionDescription(action: string, user: any): string {
    switch (action) {
      case 'user_created':
        return `Created new user account for "${user.name}" (${user.username})`;
      case 'user_updated':
        return `Updated user account for "${user.name}" (${user.username})`;
      case 'user_deleted':
        return `Deleted user account for "${user.name}" (${user.username})`;
      case 'user_role_changed':
        return `Changed role of user "${user.name}" to ${user.role}`;
      case 'user_login':
        return `User "${user.name}" logged in successfully`;
      case 'user_logout':
        return `User "${user.name}" logged out`;
      case 'user_login_failed':
        return `Failed login attempt for username "${user.username}"`;
      default:
        return `${action} performed on user "${user.name}"`;
    }
  }

  private generateBookingActionDescription(action: string, booking: any): string {
    switch (action) {
      case 'booking_created':
        return `New booking created for ${booking.guestName} (Property: ${booking.propertyTitle})`;
      case 'booking_updated':
        return `Updated booking #${booking.id} for ${booking.guestName}`;
      case 'booking_confirmed':
        return `Confirmed booking #${booking.id} for ${booking.guestName}`;
      case 'booking_cancelled':
        return `Cancelled booking #${booking.id} for ${booking.guestName}`;
      case 'booking_completed':
        return `Completed booking #${booking.id} for ${booking.guestName}`;
      default:
        return `${action} performed on booking #${booking.id}`;
    }
  }

  private getActionSeverity(action: string): 'info' | 'warning' | 'error' | 'critical' {
    const criticalActions = ['user_deleted', 'property_deleted', 'system_shutdown'];
    const warningActions = ['property_rejected', 'booking_cancelled', 'user_login_failed'];
    const errorActions = ['booking_failed', 'payment_failed'];

    if (criticalActions.includes(action)) return 'critical';
    if (errorActions.includes(action)) return 'error';
    if (warningActions.includes(action)) return 'warning';
    return 'info';
  }

  private async getClientIP(): Promise<string> {
    try {
      // In a real application, you might want to get the IP from the server
      // For now, we'll use a placeholder
      return 'client-ip';
    } catch {
      return 'unknown';
    }
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}

export const auditLogger = AuditLogger.getInstance();
