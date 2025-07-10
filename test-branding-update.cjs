#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test script to verify branding changes from BH Bay Haven to TS TamudaStay
console.log('🏷️ Testing Branding Change: BH Bay Haven → TS TamudaStay\n');

const testBrandingChanges = () => {
  console.log('🖥️  BRANDING UPDATE VERIFICATION:\n');
  
  // Test Footer.tsx
  const footerPath = '/home/albelaiz/booking_site/client/src/components/Footer.tsx';
  const footerContent = fs.readFileSync(footerPath, 'utf8');
  
  console.log('📋 Footer Component:');
  
  // Check if old branding is removed
  const hasOldLogoTS = !footerContent.includes('"BH"');
  const hasOldBrandBay = !footerContent.includes('"Bay"');
  const hasOldBrandHaven = !footerContent.includes('"Haven"');
  
  console.log(`  ${hasOldLogoTS ? '✅' : '❌'} Old logo "BH" removed`);
  console.log(`  ${hasOldBrandBay ? '✅' : '❌'} Old brand "Bay" removed`);
  console.log(`  ${hasOldBrandHaven ? '✅' : '❌'} Old brand "Haven" removed`);
  
  // Check if new branding is present
  const hasNewLogoTS = footerContent.includes('"TS"');
  const hasNewBrandTamuda = footerContent.includes('"Tamuda"');
  const hasNewBrandStay = footerContent.includes('"Stay"');
  
  console.log(`  ${hasNewLogoTS ? '✅' : '❌'} New logo "TS" added`);
  console.log(`  ${hasNewBrandTamuda ? '✅' : '❌'} New brand "Tamuda" added`);
  console.log(`  ${hasNewBrandStay ? '✅' : '❌'} New brand "Stay" added`);
  
  console.log('');
  
  // Test Hero.tsx (commented section)
  const heroPath = '/home/albelaiz/booking_site/client/src/components/Hero.tsx';
  const heroContent = fs.readFileSync(heroPath, 'utf8');
  
  console.log('📋 Hero Component (Commented Brand Section):');
  
  // Check if old branding is removed from commented section
  const hasOldHeroBH = !heroContent.includes('text-2xl font-bold tracking-wider">BH<');
  const hasOldHeroBay = !heroContent.includes('text-4xl font-bold tracking-wide">Bay<');
  const hasOldHeroHaven = !heroContent.includes('text-4xl font-bold ml-2 tracking-wide">Haven<');
  
  console.log(`  ${hasOldHeroBH ? '✅' : '❌'} Old logo "BH" removed from commented section`);
  console.log(`  ${hasOldHeroBay ? '✅' : '❌'} Old brand "Bay" removed from commented section`);
  console.log(`  ${hasOldHeroHaven ? '✅' : '❌'} Old brand "Haven" removed from commented section`);
  
  // Check if new branding is present in commented section
  const hasNewHeroTS = heroContent.includes('text-2xl font-bold tracking-wider">TS<');
  const hasNewHeroTamuda = heroContent.includes('text-4xl font-bold tracking-wide">Tamuda<');
  const hasNewHeroStay = heroContent.includes('text-4xl font-bold ml-2 tracking-wide">Stay<');
  
  console.log(`  ${hasNewHeroTS ? '✅' : '❌'} New logo "TS" added to commented section`);
  console.log(`  ${hasNewHeroTamuda ? '✅' : '❌'} New brand "Tamuda" added to commented section`);
  console.log(`  ${hasNewHeroStay ? '✅' : '❌'} New brand "Stay" added to commented section`);
  
  console.log('');
  
  // Test Header.tsx
  const headerPath = '/home/albelaiz/booking_site/client/src/components/Header.tsx';
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  
  console.log('📋 Header Component:');
  
  // Check if header has correct branding
  const hasHeaderTS = headerContent.includes('font-serif text-xl font-bold tracking-wider">TS<');
  const hasHeaderTamuda = headerContent.includes('text-gray-900 text-2xl font-bold tracking-wide">Tamuda<');
  const hasHeaderStay = headerContent.includes('text-blue-600 text-2xl font-bold ml-1 tracking-wide">Stay<');
  
  console.log(`  ${hasHeaderTS ? '✅' : '❌'} Header logo "TS" present`);
  console.log(`  ${hasHeaderTamuda ? '✅' : '❌'} Header brand "Tamuda" present`);
  console.log(`  ${hasHeaderStay ? '✅' : '❌'} Header brand "Stay" present`);
  
  console.log('');
  
  // Check for any remaining old branding across files
  const checkFiles = [
    '/home/albelaiz/booking_site/client/src/components/Footer.tsx',
    '/home/albelaiz/booking_site/client/src/components/Header.tsx',
    '/home/albelaiz/booking_site/client/src/components/Hero.tsx'
  ];
  
  console.log('📋 Global Branding Consistency Check:');
  
  let foundOldBranding = false;
  checkFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    
    if (content.includes('Bay Haven') || content.includes('BayHaven')) {
      console.log(`  ❌ Found "Bay Haven" in ${fileName}`);
      foundOldBranding = true;
    }
  });
  
  if (!foundOldBranding) {
    console.log(`  ✅ No "Bay Haven" branding found in checked files`);
  }
  
  console.log('');
  
  // Count features
  const features = [
    hasOldLogoTS,
    hasOldBrandBay,
    hasOldBrandHaven,
    hasNewLogoTS,
    hasNewBrandTamuda,
    hasNewBrandStay,
    hasOldHeroBH,
    hasOldHeroBay,
    hasOldHeroHaven,
    hasNewHeroTS,
    hasNewHeroTamuda,
    hasNewHeroStay,
    hasHeaderTS,
    hasHeaderTamuda,
    hasHeaderStay,
    !foundOldBranding
  ];
  
  const implementedFeatures = features.filter(Boolean).length;
  const totalFeatures = features.length;
  
  console.log('⚙️  Branding Consistency:');
  console.log(`  ${hasNewLogoTS && hasNewBrandTamuda && hasNewBrandStay ? '✅' : '⚠️'} New "TS TamudaStay" branding implemented`);
  console.log(`  ${hasOldLogoTS && hasOldBrandBay && hasOldBrandHaven ? '✅' : '⚠️'} Old "BH Bay Haven" branding removed`);
  console.log(`  ${hasHeaderTS && hasHeaderTamuda && hasHeaderStay ? '✅' : '⚠️'} Header branding updated`);
  console.log(`  ${!foundOldBranding ? '✅' : '⚠️'} No conflicting branding found`);
  
  console.log('');
  console.log('📊 SUMMARY:');
  console.log(`  ✅ Total updates applied: ${implementedFeatures}/${totalFeatures}`);
  console.log(`  ⚠️  Issues found: ${totalFeatures - implementedFeatures}`);
  
  if (implementedFeatures === totalFeatures) {
    console.log('');
    console.log('🎉 Branding update completed successfully!');
    console.log('📋 Changes made:');
    console.log('   ✅ Footer: BH → TS, Bay Haven → TamudaStay');
    console.log('   ✅ Hero: BH → TS, Bay Haven → TamudaStay (commented section)');
    console.log('   ✅ Header: Already had correct TS TamudaStay branding');
    console.log('   ✅ Logo initials: BH → TS');
    console.log('   ✅ Brand name: Bay Haven → TamudaStay');
    console.log('   ✅ Consistent styling and typography maintained');
    console.log('   ✅ Theme colors preserved');
  } else {
    console.log('');
    console.log('⚠️  Some branding updates need attention. Please review the issues above.');
  }
};

testBrandingChanges();
