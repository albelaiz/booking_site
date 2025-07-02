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
      <header className={`${isScrolled 
        ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50" 
        : "bg-transparent"} 
        sticky top-0 z-50 transition-all duration-300 ease-out w-full`}>
        <div className="w-full bg-white/90 backdrop-blur-sm">
          <div className="container-custom flex items-center justify-between h-20">
            {/* Professional Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-all duration-300 group"
              onClick={scrollToTop}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-serif text-xl font-bold">B</span>
                </div>
                <div className="ml-3 font-serif flex items-center">
                  <span className="text-gray-900 text-2xl font-semibold">Bay</span>
                  <span className="text-blue-600 text-2xl font-semibold ml-1">Haven</span>
                </div>
              </div>
            </Link>

            {/* Professional Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Navigation />
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={onDashboardClick} 
                    className="btn-primary"
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
                  className="btn-outline"
                >
                  <Link to="/become-host">Become a host</Link>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden flex items-center p-2 text-gray-700 hover:text-gray-900 transition-colors" 
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <List className="h-6 w-6" />
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
