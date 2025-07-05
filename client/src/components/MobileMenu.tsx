
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
  getLoginMethodIcon,
  getLoginMethodText
}) => {
  if (!isOpen) return null;

  return (
    <nav className="lg:hidden py-4 border-t bg-white/95 backdrop-blur-sm">
      {/* Bay Haven Logo in Mobile Menu */}
      <div className="flex justify-center mb-4 pb-4 border-b border-gray-200">
        <Link to="/" onClick={onLinkClick} className="flex items-center space-x-2 group">
          <div className="w-8 h-8 logo-gradient flex items-center justify-center rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
            <span className="text-white font-serif text-sm font-bold">BH</span>
          </div>
          <div className="font-serif">
            <span className="text-gray-900 text-lg font-bold">Bay</span>
            <span className="text-blue-600 text-lg font-bold ml-1">Haven</span>
          </div>
        </Link>
      </div>
      
      <Navigation isMobile onLinkClick={onLinkClick} />
      <div className="mt-4">
        {isLoggedIn ? (
          <div className="space-y-2">
            <Button 
              onClick={onDashboardClick} 
              className="w-full bg-moroccan-gold hover:bg-moroccan-gold/90 text-white"
            >
              Dashboard
            </Button>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-moroccan-blue text-white text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{userName}</div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    {getLoginMethodIcon()}
                    <span>{getLoginMethodText()}</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={onLogout}
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1 lg:space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 lg:px-3"
              >
                <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline text-xs lg:text-sm">Logout</span>
              </Button>
            </div>
          </div>
        ) : (
          <Link 
            to="/become-host" 
            onClick={onLinkClick}
            className="w-full bg-moroccan-gold hover:bg-moroccan-gold/90 text-white inline-flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-200 font-medium"
          >
            Become a Host
          </Link>
        )}
      </div>
    </nav>
  );
};

export default MobileMenu;
