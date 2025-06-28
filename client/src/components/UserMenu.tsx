
import React from 'react';
import { User, Mail, Lock, ChevronDown, LogOut } from 'lucide-react';
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface UserMenuProps {
  userName: string;
  loginMethod: string;
  onProfileClick: () => void;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ userName, loginMethod, onProfileClick, onLogout }) => {
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

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {getLoginMethodIcon()}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-moroccan-blue text-white text-sm">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-3 w-3 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
          <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
            <User className="h-4 w-4" />
            <div>
              <div className="font-medium">{userName}</div>
              <div className="text-xs text-gray-500">{getLoginMethodText()}</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={onProfileClick}
            className="cursor-pointer hover:bg-gray-100"
          >
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={onLogout} 
            className="text-red-600 cursor-pointer hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
