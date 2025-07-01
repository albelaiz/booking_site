import { useState, useEffect } from "react";
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <header className={`${isScrolled ? "bg-white shadow-sm" : "bg-transparent"} sticky top-0 z-50 transition-all duration-300 w-full`}>
        <div className="w-full bg-slate-200">
          <div className="container-custom flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={scrollToTop}
            >
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
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-14 2xl:space-x-20">
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
                  asChild
                  className="bg-moroccan-gold hover:bg-moroccan-gold/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  <Link to="/become-host">Become a host</Link>
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
