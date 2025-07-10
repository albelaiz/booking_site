const fs = require('fs');

// Test the mobile menu improvements
function testMobileMenuUpdates() {
  console.log('🎨 Testing Mobile Menu Button Improvements\n');

  const results = {
    navigationUpdates: [],
    mobileMenuUpdates: [],
    buttonStyling: [],
    issues: []
  };

  // Check Navigation.tsx for mobile button styling
  const navigationPath = '/home/albelaiz/booking_site/client/src/components/Navigation.tsx';
  if (fs.existsSync(navigationPath)) {
    const navigationContent = fs.readFileSync(navigationPath, 'utf8');
    
    if (navigationContent.includes('py-3 px-4 rounded-lg')) {
      results.navigationUpdates.push('✅ Navigation: Button-style padding added');
    }
    
    if (navigationContent.includes('bg-moroccan-blue text-white')) {
      results.navigationUpdates.push('✅ Navigation: Active state styling implemented');
    }
    
    if (navigationContent.includes('hover:bg-moroccan-blue hover:text-white')) {
      results.navigationUpdates.push('✅ Navigation: Hover effects with moroccan colors');
    }
    
    if (navigationContent.includes('grid grid-cols-1 gap-3')) {
      results.navigationUpdates.push('✅ Navigation: Grid layout for mobile buttons');
    }
  } else {
    results.issues.push('❌ Navigation.tsx not found');
  }

  // Check MobileMenu.tsx for consistent button styling
  const mobileMenuPath = '/home/albelaiz/booking_site/client/src/components/MobileMenu.tsx';
  if (fs.existsSync(mobileMenuPath)) {
    const mobileMenuContent = fs.readFileSync(mobileMenuPath, 'utf8');
    
    if (mobileMenuContent.includes('mt-6 px-4')) {
      results.mobileMenuUpdates.push('✅ MobileMenu: Enhanced spacing and padding');
    }
    
    if (mobileMenuContent.includes('bg-moroccan-gold')) {
      results.mobileMenuUpdates.push('✅ MobileMenu: Dashboard button uses moroccan gold');
    }
    
    if (mobileMenuContent.includes('hover:scale-105')) {
      results.mobileMenuUpdates.push('✅ MobileMenu: Button hover animations added');
    }
    
    if (mobileMenuContent.includes('rounded-lg border border-gray-200')) {
      results.mobileMenuUpdates.push('✅ MobileMenu: User info section styled');
    }
    
    if (mobileMenuContent.includes('border-red-200 hover:border-red-300')) {
      results.mobileMenuUpdates.push('✅ MobileMenu: Logout button enhanced styling');
    }
  } else {
    results.issues.push('❌ MobileMenu.tsx not found');
  }

  // Check for color definitions
  const tailwindPath = '/home/albelaiz/booking_site/tailwind.config.js';
  if (fs.existsSync(tailwindPath)) {
    const tailwindContent = fs.readFileSync(tailwindPath, 'utf8');
    
    if (tailwindContent.includes('moroccan-blue') && tailwindContent.includes('moroccan-gold')) {
      results.buttonStyling.push('✅ Moroccan color scheme available');
    }
  }

  // Print results
  console.log('📱 MOBILE MENU IMPROVEMENTS:\n');
  
  if (results.navigationUpdates.length > 0) {
    console.log('🧭 Navigation Component Updates:');
    results.navigationUpdates.forEach(update => console.log(`  ${update}`));
    console.log('');
  }
  
  if (results.mobileMenuUpdates.length > 0) {
    console.log('📋 Mobile Menu Component Updates:');
    results.mobileMenuUpdates.forEach(update => console.log(`  ${update}`));
    console.log('');
  }
  
  if (results.buttonStyling.length > 0) {
    console.log('🎨 Button Styling:');
    results.buttonStyling.forEach(style => console.log(`  ${style}`));
    console.log('');
  }

  if (results.issues.length > 0) {
    console.log('⚠️  Issues:');
    results.issues.forEach(issue => console.log(`  ${issue}`));
    console.log('');
  }

  const totalUpdates = results.navigationUpdates.length + results.mobileMenuUpdates.length + results.buttonStyling.length;
  
  console.log('📊 SUMMARY:');
  console.log(`  ✅ Total improvements: ${totalUpdates}`);
  console.log(`  ⚠️  Issues found: ${results.issues.length}`);
  
  if (totalUpdates >= 6 && results.issues.length === 0) {
    console.log('\n🎉 Mobile menu has been successfully enhanced with button styling!');
    console.log('📱 Features implemented:');
    console.log('   • Button-style navigation links (Home, Properties, About, Contact)');
    console.log('   • Consistent Dashboard button styling');
    console.log('   • Enhanced hover effects and animations');
    console.log('   • Professional spacing and layout');
    console.log('   • Moroccan color scheme integration');
    console.log('   • Improved user experience on mobile devices');
  } else {
    console.log('\n⚠️  Some mobile menu improvements may need attention.');
  }

  return totalUpdates >= 6 && results.issues.length === 0;
}

// Run the test
try {
  testMobileMenuUpdates();
} catch (error) {
  console.error('❌ Test failed:', error.message);
}
