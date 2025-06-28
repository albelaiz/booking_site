
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
    `${isMobile ? 'block text-base' : 'text-sm font-medium'} transition-colors hover:text-moroccan-blue ${
      isActive ? "text-moroccan-blue" : "text-gray-700"
    }`;

  if (isMobile) {
    return (
      <ul className="flex flex-col space-y-4">
        {navigationLinks.map(link => (
          <li key={link.path}>
            <NavLink 
              to={link.path} 
              className={linkClass}
              onClick={onLinkClick}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {navigationLinks.map(link => (
        <NavLink 
          key={link.path} 
          to={link.path} 
          className={linkClass}
        >
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
