
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loginMethod, setLoginMethod] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const name = localStorage.getItem('userName') || 'User';
      const method = localStorage.getItem('loginMethod') || '';
      setIsLoggedIn(loggedIn);
      setUserName(name);
      setLoginMethod(method);
    };

    checkAuth();
  }, []);

  const navigateByRole = (userRole: string | null) => {
    console.log('User role:', userRole);
    
    switch (userRole) {
      case 'admin':
        console.log('Navigating to admin dashboard');
        navigate('/admin');
        break;
      case 'staff':
        console.log('Navigating to staff dashboard');
        navigate('/staff');
        break;
      case 'owner':
        console.log('Navigating to owner dashboard');
        navigate('/owner-dashboard');
        break;
      case 'user':
      case 'customer':
      default:
        console.log('Navigating to user dashboard (default)');
        navigate('/dashboard');
        break;
    }
  };

  const handleDashboardClick = (onShowAuthModal: () => void) => {
    if (isLoggedIn) {
      const userRole = localStorage.getItem('userRole');
      navigateByRole(userRole);
    } else {
      onShowAuthModal();
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setUserName(localStorage.getItem('userName') || 'User');
    setLoginMethod(localStorage.getItem('loginMethod') || '');
    
    const userRole = localStorage.getItem('userRole');
    console.log('Auth success, user role:', userRole);
    navigateByRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginMethod');
    setIsLoggedIn(false);
    setUserName('');
    setLoginMethod('');
    navigate('/');
  };

  const handleProfileClick = () => {
    const userRole = localStorage.getItem('userRole');
    console.log('Profile click, user role:', userRole);
    navigateByRole(userRole);
  };

  const getLoginMethodIcon = () => {
    switch (loginMethod) {
      case 'google':
        return null;
      case 'email':
        return <Mail className="h-3 w-3 text-green-500" />;
      case 'credentials':
        return <Lock className="h-3 w-3 text-orange-500" />;
      default:
        return <User className="h-3 w-3 text-gray-500" />;
    }
  };

  const getLoginMethodText = () => {
    switch (loginMethod) {
      case 'google':
        return 'Google';
      case 'email':
        return 'Email';
      case 'credentials':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return {
    isLoggedIn,
    userName,
    loginMethod,
    handleDashboardClick,
    handleAuthSuccess,
    handleLogout,
    handleProfileClick,
    getLoginMethodIcon,
    getLoginMethodText
  };
};
