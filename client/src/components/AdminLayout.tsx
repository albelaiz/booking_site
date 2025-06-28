import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Settings, Cog, Database, LogOut } from 'lucide-react';
import { Button } from "./ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  currentPath?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  currentPath = '/admin' 
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
      path: '/admin', 
      icon: Building 
    },
    { 
      name: 'Properties', 
      path: '/admin/properties', 
      icon: Building 
    },
    { 
      name: 'Bookings', 
      path: '/admin/bookings', 
      icon: Building 
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
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
              <span className="font-serif text-sm">M</span>
            </div>
            <div className="font-serif text-lg text-moroccan-blue">
              <span>Martil</span>
              <span className="text-moroccan-gold">Haven</span>
            </div>
          </Link>
        </div>
        <div className="py-4">
          <div className="px-4 mb-4">
            <p className="text-xs uppercase font-medium text-gray-500">Main</p>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 ${
                  item.path === currentPath
                    ? 'bg-moroccan-blue/10 text-moroccan-blue border-r-4 border-moroccan-blue'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} className="mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="px-4 mt-8 mb-4">
            <p className="text-xs uppercase font-medium text-gray-500">Settings</p>
          </div>
          <nav className="space-y-1">
            <Link
              to="/admin/settings"
              className={`flex items-center px-4 py-3 ${
                currentPath === '/admin/settings'
                  ? 'bg-moroccan-blue/10 text-moroccan-blue border-r-4 border-moroccan-blue'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings size={18} className="mr-3" />
              <span>General Settings</span>
            </Link>
            <Link
              to="/admin/system"
              className={`flex items-center px-4 py-3 ${
                currentPath === '/admin/system'
                  ? 'bg-moroccan-blue/10 text-moroccan-blue border-r-4 border-moroccan-blue'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Database size={18} className="mr-3" />
              <span>System</span>
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
                  <span className="text-sm font-medium">A</span>
                </div>
                <span className="font-medium text-sm text-gray-700">Admin</span>
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

export default AdminLayout;