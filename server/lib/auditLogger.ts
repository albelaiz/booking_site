import { db } from "../db.js";
import { auditLogs, insertAuditLogSchema } from "../../shared/schema.js";
import type { z } from "zod";

export interface AuditLogData {
  userId: number;
  action: string;
  entity: string;
  entityId?: number | null;
  oldValues?: any;
  newValues?: any;
  description?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  ipAddress?: string;
  userAgent?: string;
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

  public async log(data: AuditLogData): Promise<void> {
    if (!this.enabled) {
      return;
    }

    try {
      const auditLogData = {
        ...data,
        timestamp: new Date(),
        severity: data.severity || 'info'
      };

      await db.insert(auditLogs).values(auditLogData);
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw to avoid breaking the main operation
    }
  }

  public async logUserAction(
    userId: number, 
    action: string, 
    description?: string,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entity: 'user',
      description,
      severity
    });
  }

  public async logPropertyAction(
    userId: number, 
    action: string, 
    propertyId?: number,
    oldValues?: any,
    newValues?: any,
    description?: string,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entity: 'property',
      entityId: propertyId,
      oldValues,
      newValues,
      description,
      severity
    });
  }

  public async logBookingAction(
    userId: number, 
    action: string, 
    bookingId?: number,
    oldValues?: any,
    newValues?: any,
    description?: string,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entity: 'booking',
      entityId: bookingId,
      oldValues,
      newValues,
      description,
      severity
    });
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

// Export singleton instance
export const auditLogger = AuditLogger.getInstance();
