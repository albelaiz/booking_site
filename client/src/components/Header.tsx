import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogIn, Search } from 'lucide-react';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import UserMenu from './UserMenu';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200' 
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="site-container">
          <div className="header-content">
            {/* Logo on the left */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-serif text-lg font-bold tracking-wider">TS</span>
                </div>
                <div className="absolute inset-0 bg-blue-400 rounded-xl blur opacity-30 animate-pulse"></div>
              </div>
              <div className="font-serif">
                <div className="flex items-baseline">
                  <span className="text-gray-900 text-2xl font-bold tracking-wide">Tamuda</span>
                  <span className="text-blue-600 text-2xl font-bold ml-1 tracking-wide">Stay</span>
                </div>
                {/* <span className="text-xs text-gray-600 tracking-widest uppercase font-sans hidden sm:block">
                  Premium Vacation Rentals
                </span> */}
              </div>
            </Link>

            {/* Hamburger Menu on the right */}
            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-200 z-50"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Header;