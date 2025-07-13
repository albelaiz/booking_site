
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavigationProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false, onLinkClick }) => {
  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${isMobile 
      ? 'block w-full text-center py-3 px-4 rounded-lg font-medium transition-all duration-200 border' 
      : 'text-sm font-semibold tracking-wide'
    } transition-all duration-300 ease-out hover:text-moroccan-blue hover:scale-105 hover:-translate-y-0.5 transform relative group ${
      isActive 
        ? isMobile 
          ? "bg-moroccan-blue text-white border-moroccan-blue shadow-md" 
          : "text-moroccan-blue"
        : isMobile
          ? "text-gray-700 bg-gray-50 border-gray-200 hover:bg-moroccan-blue hover:text-white hover:border-moroccan-blue"
          : "text-gray-700"
    }`;

  const activeLinkIndicator = `absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-moroccan-blue to-moroccan-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out`;

  if (isMobile) {
    return (
      <div className="px-4">
        <div className="grid grid-cols-1 gap-3">
          {navigationLinks.map(link => (
            <NavLink 
              key={link.path}
              to={link.path} 
              className={linkClass}
              onClick={onLinkClick}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav className="hidden lg:flex items-center space-x-10">
      {navigationLinks.map(link => (
        <NavLink 
          key={link.path} 
          to={link.path} 
          className={linkClass}
        >
          <span className="relative py-2">
            {link.name}
            <div className={activeLinkIndicator}></div>
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
