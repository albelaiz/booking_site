
import React from 'react';
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
    <nav className="lg:hidden py-4 border-t">
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
          <Button 
            onClick={onDashboardClick} 
            className="w-full bg-moroccan-gold hover:bg-moroccan-gold/90 text-white"
          >
            Become a host
          </Button>
        )}
      </div>
    </nav>
  );
};

export default MobileMenu;
