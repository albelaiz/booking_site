
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, LogOut } from 'lucide-react';
import { Button } from "./ui/button";

interface StaffLayoutProps {
  children: React.ReactNode;
  title: string;
  currentPath?: string;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ 
  children, 
  title, 
  currentPath = '/staff' 
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginMethod');
    navigate('/');
  };

  const sidebarItems = [
    { 
      name: 'Dashboard', 
      path: '/staff', 
      icon: Building 
    },
    { 
      name: 'Properties', 
      path: '/staff/properties', 
      icon: Building 
    },
    { 
      name: 'Bookings', 
      path: '/staff/bookings', 
      icon: Building 
    }
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-moroccan-blue text-white p-2 rounded">
              <span className="font-serif text-sm">B</span>
            </div>
            <div className="font-serif text-lg text-moroccan-blue">
              <span>Blue</span>
              <span className="text-moroccan-gold">Bay</span>
            </div>
          </Link>
        </div>
        <div className="py-4">
          <div className="px-4 mb-4">
            <p className="text-xs uppercase font-medium text-gray-500">Staff Portal</p>
          </div>
          <nav className="space-y-1">
              <Link
                to="/staff"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPath === '/staff'
                    ? 'bg-moroccan-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Building className="mr-3 h-4 w-4" />
                Dashboard
              </Link>

              <Link
                to="/staff/properties"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPath === '/staff/properties'
                    ? 'bg-moroccan-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Building className="mr-3 h-4 w-4" />
                Property Management
              </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-medium text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-moroccan-blue text-white flex items-center justify-center">
                  <span className="text-sm font-medium">S</span>
                </div>
                <span className="font-medium text-sm text-gray-700">Staff</span>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
