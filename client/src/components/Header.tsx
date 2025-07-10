import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { List, X } from "lucide-react";
import AuthModal from "./AuthModal";
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
          <div className="site-container flex items-center justify-between h-20">
            {/* Enhanced TamudaStay Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-all duration-300 group"
              onClick={scrollToTop}
            >
              <div className="flex items-center">
                {/* Enhanced Logo Icon */}
                <div className="relative">
                  <div className="w-12 h-12 logo-gradient flex items-center justify-center rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-white font-serif text-xl font-bold tracking-wider">TS</span>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-blue-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                {/* Enhanced Text */}
                <div className="ml-4 font-serif flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-gray-900 text-2xl font-bold tracking-wide">Tamuda</span>
                    <span className="text-blue-600 text-2xl font-bold ml-1 tracking-wide">Stay</span>
                  </div>
                  <span className="text-xs text-gray-500 tracking-widest uppercase font-sans">Morocco</span>
                </div>
              </div>
            </Link>

            {/* Hamburger Menu Button - Always Visible */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="flex items-center p-3 text-gray-700 hover:text-gray-900 transition-all duration-200 hover:bg-gray-100 rounded-lg" 
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
          {/* Navigation Menu - Now universal for all screen sizes */}
          <MobileMenu 
            isOpen={isMobileMenuOpen}
            isLoggedIn={isLoggedIn}
            userName={userName}
            loginMethod={loginMethod}
            onDashboardClick={onDashboardClick}
            onLogout={handleLogout}
            onLinkClick={() => setIsMobileMenuOpen(false)}
            onProfileClick={handleProfileClick}
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
