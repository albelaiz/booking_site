import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    name: string;
    email?: string;
    role: string;
    status: string;
  };
}

/**
 * Middleware to require specific roles
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        required: allowedRoles,
        current: userRole || 'none'
      });
    }
    
    next();
  };
};

/**
 * Middleware to require admin role
 */
export const requireAdmin = requireRole(['admin']);

/**
 * Middleware to require admin or staff role
 */
export const requireAdminOrStaff = requireRole(['admin', 'staff']);

/**
 * Middleware to require any authenticated user
 */
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required. Please log in.' 
    });
  }
  
  next();
};

/**
 * Middleware to check if user is active
 */
export const requireActiveUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required. Please log in.' 
    });
  }

  if (req.user.status !== 'active') {
    return res.status(403).json({ 
      error: 'Account is not active. Please contact support.' 
    });
  }
  
  next();
};

/**
 * Middleware to check if user can access owner features
 */
export const requireOwnerAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  
  // Admin, staff, and users with owner role can access owner features
  if (!userRole || !['admin', 'staff', 'user'].includes(userRole)) {
    return res.status(403).json({ 
      error: 'Access denied. Owner permissions required.',
      current: userRole || 'none'
    });
  }
  
  next();
};

/**
 * Utility function to check if user has role
 */
export const hasRole = (user: any, roles: string[]): boolean => {
  return user && user.role && roles.includes(user.role);
};

/**
 * Utility function to check if user is admin
 */
export const isAdmin = (user: any): boolean => {
  return hasRole(user, ['admin']);
};

/**
 * Utility function to check if user is admin or staff
 */
export const isAdminOrStaff = (user: any): boolean => {
  return hasRole(user, ['admin', 'staff']);
};
