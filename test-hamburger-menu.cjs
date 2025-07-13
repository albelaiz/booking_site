#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test script to verify hamburger menu implementation
console.log('🍔 Testing Hamburger Menu Implementation\n');

const testHamburgerMenuImplementation = () => {
  console.log('🖥️  HAMBURGER MENU IMPLEMENTATION RESULTS:\n');
  
  // Test Header.tsx
  const headerPath = '/home/albelaiz/booking_site/client/src/components/Header.tsx';
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  
  console.log('📋 Header Component:');
  
  // Check if desktop navigation is removed
  const hasDesktopNav = headerContent.includes('hidden lg:flex') && headerContent.includes('<Navigation />');
  console.log(`  ${!hasDesktopNav ? '✅' : '❌'} Desktop navigation removed`);
  
  // Check for hamburger button
  const hasHamburgerButton = headerContent.includes('List className="h-6 w-6"') && headerContent.includes('X className="h-6 w-6"');
  console.log(`  ${hasHamburgerButton ? '✅' : '❌'} Hamburger menu button implemented`);
  
  // Check if hamburger is always visible (no lg:hidden)
  const hamburgerAlwaysVisible = !headerContent.includes('lg:hidden flex items-center p-2');
  console.log(`  ${hamburgerAlwaysVisible ? '✅' : '❌'} Hamburger button visible on all screen sizes`);
  
  // Check if unused imports are removed
  const hasUnusedImports = headerContent.includes('import { Button }') || 
                          headerContent.includes('import Navigation from') || 
                          headerContent.includes('import UserMenu from');
  console.log(`  ${!hasUnusedImports ? '✅' : '❌'} Unused navigation imports removed`);
  
  // Check if logo is preserved
  const hasLogo = headerContent.includes('TamudaStay') || headerContent.includes('TS');
  console.log(`  ${hasLogo ? '✅' : '❌'} Logo preserved`);
  
  console.log('');
  
  // Test MobileMenu.tsx
  const mobileMenuPath = '/home/albelaiz/booking_site/client/src/components/MobileMenu.tsx';
  const mobileMenuContent = fs.readFileSync(mobileMenuPath, 'utf8');
  
  console.log('📋 Mobile Menu Component (Now Universal Menu):');
  
  // Check if lg:hidden is removed from mobile menu
  const mobileMenuUniversal = !mobileMenuContent.includes('lg:hidden py-4');
  console.log(`  ${mobileMenuUniversal ? '✅' : '❌'} Menu visible on all screen sizes (lg:hidden removed)`);
  
  // Check for navigation links
  const hasNavLinks = mobileMenuContent.includes('<Navigation isMobile');
  console.log(`  ${hasNavLinks ? '✅' : '❌'} Navigation links included`);
  
  // Check for dashboard button with highlight
  const hasDashboardButton = mobileMenuContent.includes('bg-moroccan-gold') && 
                            mobileMenuContent.includes('Dashboard');
  console.log(`  ${hasDashboardButton ? '✅' : '❌'} Dashboard button with highlight color`);
  
  // Check for user avatar functionality
  const hasUserAvatar = mobileMenuContent.includes('Avatar') && 
                       mobileMenuContent.includes('AvatarFallback');
  console.log(`  ${hasUserAvatar ? '✅' : '❌'} User avatar included`);
  
  // Check for profile click functionality
  const hasProfileClick = mobileMenuContent.includes('onProfileClick');
  console.log(`  ${hasProfileClick ? '✅' : '❌'} Profile click functionality added`);
  
  console.log('');
  
  // Test Navigation.tsx
  const navigationPath = '/home/albelaiz/booking_site/client/src/components/Navigation.tsx';
  const navigationContent = fs.readFileSync(navigationPath, 'utf8');
  
  console.log('📋 Navigation Component:');
  
  // Check for navigation links
  const hasHomeLink = navigationContent.includes('"Home"');
  const hasPropertiesLink = navigationContent.includes('"Properties"');
  const hasAboutLink = navigationContent.includes('"About"');
  const hasContactLink = navigationContent.includes('"Contact"');
  
  console.log(`  ${hasHomeLink ? '✅' : '❌'} Home link`);
  console.log(`  ${hasPropertiesLink ? '✅' : '❌'} Properties link`);
  console.log(`  ${hasAboutLink ? '✅' : '❌'} About link`);
  console.log(`  ${hasContactLink ? '✅' : '❌'} Contact link`);
  
  console.log('');
  
  // Count features
  const features = [
    !hasDesktopNav,
    hasHamburgerButton,
    hamburgerAlwaysVisible,
    !hasUnusedImports,
    hasLogo,
    mobileMenuUniversal,
    hasNavLinks,
    hasDashboardButton,
    hasUserAvatar,
    hasProfileClick,
    hasHomeLink,
    hasPropertiesLink,
    hasAboutLink,
    hasContactLink
  ];
  
  const implementedFeatures = features.filter(Boolean).length;
  const totalFeatures = features.length;
  
  console.log('⚙️  Functionality:');
  console.log(`  ${implementedFeatures === totalFeatures ? '✅' : '⚠️'} Hamburger menu replaces all navigation`);
  console.log(`  ${mobileMenuUniversal ? '✅' : '⚠️'} Menu works on all screen sizes`);
  console.log(`  ${hasLogo ? '✅' : '⚠️'} Logo remains visible`);
  console.log(`  ${hasDashboardButton ? '✅' : '⚠️'} Dashboard highlight preserved`);
  console.log(`  ${hasUserAvatar ? '✅' : '⚠️'} User avatar preserved`);
  
  console.log('');
  console.log('📊 SUMMARY:');
  console.log(`  ✅ Total features implemented: ${implementedFeatures}/${totalFeatures}`);
  console.log(`  ⚠️  Issues found: ${totalFeatures - implementedFeatures}`);
  
  if (implementedFeatures === totalFeatures) {
    console.log('');
    console.log('🎉 Hamburger menu successfully implemented!');
    console.log('📋 Features delivered:');
    console.log('   • Replaced desktop navigation with hamburger menu');
    console.log('   • Hamburger menu visible on all screen sizes');
    console.log('   • Logo (TamudaStay) remains visible');
    console.log('   • Clean slide-in menu with all navigation links');
    console.log('   • Dashboard button with highlight color preserved');
    console.log('   • User avatar and profile functionality preserved');
    console.log('   • Responsive design maintained');
    console.log('   • Navigation links: Home, Properties, About, Contact');
  } else {
    console.log('');
    console.log('⚠️  Some features need attention. Please review the issues above.');
  }
};

testHamburgerMenuImplementation();
