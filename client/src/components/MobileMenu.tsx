import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, Building2, Phone, User, LogIn, Settings, Heart, History, HelpCircle, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Close Button */}
      <div className="p-4 flex justify-end">
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col h-full">
        {/* Navigation Links */}
        <div className="space-y-2">
          <Link
            to="/"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200 group"
            onClick={onClose}
          >
            <Home className="w-5 h-5 mr-3 group-hover:text-blue-600" />
            Home
          </Link>

          <Link
            to="/about"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200 group"
            onClick={onClose}
          >
            <Info className="w-5 h-5 mr-3 group-hover:text-blue-600" />
            About
          </Link>

          <Link
            to="/contact"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200 group"
            onClick={onClose}
          >
            <Phone className="w-5 h-5 mr-3 group-hover:text-blue-600" />
            Contact
          </Link>
        </div>

        {/* Authentication Links */}
        <div className="mt-auto p-4 space-y-2 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200 group"
                onClick={onClose}
              >
                <Settings className="w-5 h-5 mr-3 group-hover:text-blue-600" />
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200 group"
              >
                <LogIn className="w-5 h-5 mr-3 group-hover:text-blue-600" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200 group"
                onClick={onClose}
              >
                <LogIn className="w-5 h-5 mr-3 group-hover:text-blue-600" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors duration-200 group"
                onClick={onClose}
              >
                <User className="w-5 h-5 mr-3 group-hover:text-blue-600" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;