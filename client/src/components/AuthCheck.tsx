
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthCheckProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'staff' | 'user' | 'owner' | 'any';
}

const AuthCheck = ({ children, requiredRole }: AuthCheckProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    // If no specific role required or 'any' role, allow any authenticated user
    if (!requiredRole || requiredRole === 'any') {
      return;
    }
    
    // Role-specific access control
    const hasAccess = (() => {
      switch (requiredRole) {
        case 'admin':
          return userRole === 'admin';
        case 'staff':
          return userRole === 'staff' || userRole === 'admin';
        case 'owner':
          return userRole === 'owner' || userRole === 'admin';
        case 'user':
          return userRole === 'user' || userRole === 'customer' || userRole === 'admin';
        default:
          return false;
      }
    })();
    
    if (!hasAccess) {
      navigate('/');
    }
  }, [navigate, requiredRole]);
  
  return <>{children}</>;
};

export default AuthCheck;
