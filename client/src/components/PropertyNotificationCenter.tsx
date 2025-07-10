import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, CheckCircle, XCircle, Clock, Bell } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface Notification {
  id: string;
  type: 'property_approved' | 'property_rejected' | 'property_submitted';
  title: string;
  message: string;
  propertyId: string;
  propertyTitle: string;
  timestamp: string;
  read: boolean;
}

interface PropertyNotificationCenterProps {
  userId: string;
  userRole: string;
}

const PropertyNotificationCenter: React.FC<PropertyNotificationCenterProps> = ({ userId, userRole }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Mock notifications - in a real app, these would come from an API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'property_approved',
        title: 'Property Approved',
        message: 'Your property "Villa Tamuda Bay" has been approved and is now live!',
        propertyId: '1',
        propertyTitle: 'Villa Tamuda Bay',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false
      },
      {
        id: '2',
        type: 'property_submitted',
        title: 'Property Submitted',
        message: 'Your property "Riad Martil" has been submitted for review.',
        propertyId: '2',
        propertyTitle: 'Riad Martil',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true
      }
    ];

    // Only show notifications for property owners
    if (userRole === 'owner') {
      setNotifications(mockNotifications);
    }
  }, [userId, userRole]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'property_approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'property_rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'property_submitted':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  // Don't show notification center for non-owners
  if (userRole !== 'owner' || notifications.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Property Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-b-0 ${
                    !notification.read ? 'bg-blue-50' : 'bg-white'
                  } hover:bg-gray-50 transition-colors cursor-pointer`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600"
                onClick={() => {
                  // In a real app, this would navigate to a full notifications page
                  toast({
                    title: "View All Notifications",
                    description: "This would open the full notifications page.",
                  });
                }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyNotificationCenter;
