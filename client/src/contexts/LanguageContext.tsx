import React, { createContext, useContext } from 'react';

export type Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// English-only translations
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.host': 'Become a Host',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',

    // Hero Section
    'hero.title': 'Discover Your Perfect Getaway',
    'hero.subtitle': 'Experience luxury vacation rentals in beautiful coastal Morocco',
    'hero.cta': 'Start Your Journey',

    // Search
    'search.where': 'Where to?',
    'search.checkin': 'Check-in',
    'search.checkout': 'Check-out',
    'search.guests': 'Guests',
    'search.button': 'Search Properties',

    // Property Cards
    'property.from': 'From',
    'property.night': 'night',
    'property.guests': 'guests',
    'property.bedrooms': 'bedrooms',
    'property.bathrooms': 'bathrooms',
    'property.book': 'Book Now',
    'property.details': 'View Details',

    // Booking
    'booking.title': 'Book Your Stay',
    'booking.dates': 'Select Dates',
    'booking.guests': 'Number of Guests',
    'booking.total': 'Total',
    'booking.book': 'Book Now',
    'booking.instant': 'Instant Booking',

    // Footer
    'footer.company': 'TamudaStay',
    'footer.description': 'Your gateway to luxury vacation rentals in Morocco',
    'footer.links': 'Quick Links',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.follow': 'Follow Us',
    'footer.rights': 'All rights reserved.',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try Again',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.clear': 'Clear',
    'common.apply': 'Apply',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language: Language = 'en';

  const setLanguage = (lang: Language) => {
    // Language switching disabled - always English
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};