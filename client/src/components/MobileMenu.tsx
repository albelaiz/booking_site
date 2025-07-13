
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Navigation from './Navigation';

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  userName: string;
  loginMethod: string;
  onDashboardClick: () => void;
  onLogout: () => void;
  onLinkClick: () => void;
  onProfileClick?: () => void;
  getLoginMethodIcon: () => React.ReactNode;
  getLoginMethodText: () => string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isLoggedIn,
  userName,
  loginMethod,
  onDashboardClick,
  onLogout,
  onLinkClick,
  onProfileClick,
  getLoginMethodIcon,
  getLoginMethodText
}) => {
  if (!isOpen) return null;

  return (
    <nav className="py-4 border-t bg-white/95 backdrop-blur-sm">
      {/* Navigation Buttons */}
      <Navigation isMobile onLinkClick={onLinkClick} />
      
      {/* Dashboard/Auth Section */}
      <div className="mt-6 px-4">
        {isLoggedIn ? (
          <div className="space-y-3">
            {/* Dashboard Button - Styled to match navigation */}
            <button 
              onClick={onDashboardClick} 
              className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 border bg-moroccan-gold text-white border-moroccan-gold shadow-md hover:bg-moroccan-gold/90 hover:shadow-lg transform hover:scale-105"
            >
              Dashboard
            </button>
            
            {/* User Info Section */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <button 
                onClick={() => {
                  if (onProfileClick) onProfileClick();
                  onLinkClick();
                }}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-moroccan-blue text-white text-xs font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-gray-900 truncate">{userName}</div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    {getLoginMethodIcon()}
                    <span className="truncate">{getLoginMethodText()}</span>
                  </div>
                </div>
              </button>
              <Button 
                onClick={onLogout}
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 border-red-200 hover:border-red-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-xs">Logout</span>
              </Button>
            </div>
          </div>
        ) : (
          <Link 
            to="/become-host" 
            onClick={onLinkClick}
            className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 border bg-moroccan-gold text-white border-moroccan-gold shadow-md hover:bg-moroccan-gold/90 hover:shadow-lg transform hover:scale-105 inline-flex items-center justify-center"
          >
            Become a Host
          </Link>
        )}
      </div>
    </nav>
  );
};

export default MobileMenu;
