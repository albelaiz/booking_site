
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
    `${isMobile ? 'block text-base' : 'text-sm font-semibold tracking-wide'} transition-all duration-300 ease-out hover:text-moroccan-blue hover:scale-105 hover:-translate-y-0.5 transform relative group ${
      isActive ? "text-moroccan-blue" : "text-gray-700"
    }`;

  const activeLinkIndicator = `absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-moroccan-blue to-moroccan-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out`;

  if (isMobile) {
    return (
      <ul className="flex flex-col space-y-6">
        {navigationLinks.map(link => (
          <li key={link.path}>
            <NavLink 
              to={link.path} 
              className={linkClass}
              onClick={onLinkClick}
            >
              <span className="relative">
                {link.name}
                <div className={activeLinkIndicator}></div>
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
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
