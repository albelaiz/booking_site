import WebSocket from 'ws';
import { db } from '../db.js';
import { notifications, users, User } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

interface ConnectedUser {
  userId: number;
  ws: WebSocket;
  role: string;
}

interface NotificationData {
  type: string;
  propertyId?: number;
  title: string;
  message: string;
  hostName?: string;
  hostId?: number;
  status?: string;
  rejectionReason?: string;
  timestamp?: string;
}

class NotificationService {
  private connectedUsers: Map<number, ConnectedUser> = new Map();

  addConnection(userId: number, ws: WebSocket, role: string) {
    this.connectedUsers.set(userId, { userId, ws, role });
    console.log(`User ${userId} (${role}) connected to WebSocket`);
  }

  removeConnection(userId: number) {
    this.connectedUsers.delete(userId);
    console.log(`User ${userId} disconnected from WebSocket`);
  }

  async sendToAdmins(notification: NotificationData) {
    const adminConnections = Array.from(this.connectedUsers.values())
      .filter(user => user.role === 'admin' || user.role === 'staff');

    console.log(`Sending notification to ${adminConnections.length} admin(s)`);

    adminConnections.forEach(admin => {
      if (admin.ws.readyState === WebSocket.OPEN) {
        admin.ws.send(JSON.stringify({
          type: 'PROPERTY_REVIEW_REQUEST',
          data: notification
        }));
      }
    });
  }

  async sendToHost(hostId: number, notification: NotificationData) {
    const hostConnection = this.connectedUsers.get(hostId);
    if (hostConnection && hostConnection.ws.readyState === WebSocket.OPEN) {
      console.log(`Sending notification to host ${hostId}`);
      hostConnection.ws.send(JSON.stringify({
        type: notification.type,
        data: notification
      }));
    } else {
      console.log(`Host ${hostId} not connected to WebSocket`);
    }
  }

  async broadcastToAll(notification: NotificationData) {
    const allConnections = Array.from(this.connectedUsers.values());
    console.log(`Broadcasting to ${allConnections.length} connected users`);

    allConnections.forEach(connection => {
      if (connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.send(JSON.stringify({
          type: notification.type,
          data: notification
        }));
      }
    });
  }

  async sendToUser(userId: number, notification: NotificationData) {
    const userConnection = this.connectedUsers.get(userId);
    if (userConnection && userConnection.ws.readyState === WebSocket.OPEN) {
      console.log(`Sending notification to user ${userId}`);
      userConnection.ws.send(JSON.stringify({
        type: notification.type,
        data: notification
      }));
    } else {
      console.log(`User ${userId} not connected to WebSocket`);
    }
  }

  // Get list of connected users by role
  getConnectedUsersByRole(role: string): number[] {
    return Array.from(this.connectedUsers.values())
      .filter(user => user.role === role)
      .map(user => user.userId);
  }

  // Check if user is connected
  isUserConnected(userId: number): boolean {
    return this.connectedUsers.has(userId);
  }

  // Get connected user count
  getConnectedUserCount(): number {
    return this.connectedUsers.size;
  }
}

  async sendToHost(hostId: number, notification: NotificationData) {
    const hostConnection = this.connectedUsers.get(hostId);
    
    if (hostConnection && hostConnection.ws.readyState === WebSocket.OPEN) {
      hostConnection.ws.send(JSON.stringify({
        type: 'PROPERTY_STATUS_UPDATE',
        data: notification
      }));
      console.log(`Sent notification to host ${hostId}`);
    } else {
      console.log(`Host ${hostId} not connected to WebSocket`);
    }
  }

  async createNotification(userId: number, type: string, title: string, message: string, propertyId?: number, metadata?: any) {
    try {
      const [notification] = await db.insert(notifications).values({
        userId,
        type,
        title,
        message,
        propertyId,
        metadata: metadata ? JSON.stringify(metadata) : null
      }).returning();

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async createNotificationsForAdmins(type: string, title: string, message: string, propertyId?: number, metadata?: any) {
    try {
      // Get all admin users
      const adminUsers = await db.select()
        .from(users)
        .where(eq(users.role, 'admin'));

      // Create notifications for all admins
      const adminNotifications = adminUsers.map((admin: User) => ({
        userId: admin.id,
        type,
        title,
        message,
        propertyId,
        metadata: metadata ? JSON.stringify(metadata) : null
      }));

      if (adminNotifications.length > 0) {
        await db.insert(notifications).values(adminNotifications);
        console.log(`Created ${adminNotifications.length} admin notifications`);
      }

      return adminUsers;
    } catch (error) {
      console.error('Error creating admin notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: number, userId: number) {
    try {
      await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, notificationId));
      
      console.log(`Notification ${notificationId} marked as read by user ${userId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: number, limit = 50) {
    try {
      const userNotifications = await db.select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(notifications.createdAt)
        .limit(limit);

      return userNotifications;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  getConnectedAdminsCount() {
    return Array.from(this.connectedUsers.values())
      .filter(user => user.role === 'admin' || user.role === 'staff').length;
  }
}

export const notificationService = new NotificationService();
