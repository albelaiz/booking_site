
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { List, X } from "lucide-react";
import AuthModal from "./AuthModal";
import { Button } from "./ui/button";
import Navigation from "./Navigation";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const {
    isLoggedIn,
    userName,
    loginMethod,
    handleDashboardClick,
    handleAuthSuccess,
    handleLogout,
    handleProfileClick,
    getLoginMethodIcon,
    getLoginMethodText
  } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const onDashboardClick = () => {
    handleDashboardClick(() => setShowAuthModal(true));
    setIsMobileMenuOpen(false);
  };

  const onAuthSuccess = () => {
    setShowAuthModal(false);
    handleAuthSuccess();
  };

  return (
    <>
      <header className={`${isScrolled ? "bg-white shadow-sm" : "bg-transparent"} sticky top-0 z-50 transition-all duration-300`}>
        <div className="container-custom mx-auto px-4 bg-slate-200">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-moroccan-blue flex items-center justify-center rounded-md shadow-md">
                  <span className="text-white font-serif text-xl font-bold">B</span>
                </div>
                <div className="ml-2 font-serif flex items-center">
                  <span className="text-moroccan-blue text-xl font-medium">Bay</span>
                  <span className="text-moroccan-gold text-xl font-medium">Haven</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Navigation />
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={onDashboardClick} 
                    className="bg-moroccan-gold hover:bg-moroccan-gold/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                  >
                    Dashboard
                  </Button>
                  <UserMenu 
                    userName={userName}
                    loginMethod={loginMethod}
                    onProfileClick={handleProfileClick}
                    onLogout={handleLogout}
                  />
                </div>
              ) : (
                <Button 
                  onClick={onDashboardClick} 
                  className="bg-moroccan-gold hover:bg-moroccan-gold/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  Become a host
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden flex items-center p-2" 
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <List className="h-6 w-6 text-gray-700" />
              )}
              <span className="sr-only">
                {isMobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <MobileMenu 
            isOpen={isMobileMenuOpen}
            isLoggedIn={isLoggedIn}
            userName={userName}
            loginMethod={loginMethod}
            onDashboardClick={onDashboardClick}
            onLogout={handleLogout}
            onLinkClick={() => setIsMobileMenuOpen(false)}
            getLoginMethodIcon={getLoginMethodIcon}
            getLoginMethodText={getLoginMethodText}
          />
        </div>
      </header>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={onAuthSuccess} 
      />
    </>
  );
};

export default Header;
