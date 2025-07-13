#!/usr/bin/env node

const API_BASE = 'https://tamudastay.com/api';

console.log('🔧 TESTING: Properties Page Data Loading\n');

async function testPropertiesPageData() {
  console.log('1. Testing public properties API...');
  
  try {
    const response = await fetch(`${API_BASE}/properties/public`);
    if (response.ok) {
      const properties = await response.json();
      console.log(`✅ Public properties API working: ${properties.length} properties found`);
      
      if (properties.length > 0) {
        console.log('Sample properties:');
        properties.slice(0, 3).forEach((prop, index) => {
          console.log(`   ${index + 1}. ID: ${prop.id}, Title: "${prop.title}", Status: ${prop.status}`);
        });
      } else {
        console.log('⚠️  No properties found in public API');
      }
    } else {
      console.log(`❌ Public properties API failed: ${response.status}`);
      const errorText = await response.text();
      console.log(`   Error: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Error testing public API:', error.message);
  }
  
  console.log('');
  
  console.log('2. Testing React app loading...');
  
  try {
    const response = await fetch('https://tamudastay.com/properties');
    if (response.ok) {
      const html = await response.text();
      if (html.includes('<!DOCTYPE html>')) {
        console.log('✅ React app HTML is loading correctly');
        if (html.includes('vite')) {
          console.log('✅ Vite development server is working');
        }
      } else {
        console.log('❌ React app HTML is not loading correctly');
      }
    } else {
      console.log(`❌ React app failed to load: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error testing React app:', error.message);
  }
  
  console.log('');
  
  console.log('3. Testing if problem is with external IP access...');
  console.log('   - localhost:5000 should work (development)');
  console.log('   - 172.233.117.122:5000 might not work if server is not configured for external access');
  console.log('   - Check firewall, network configuration, or server binding');
  
  console.log('');
  console.log('🔧 POSSIBLE SOLUTIONS:');
  console.log('1. If accessing from external IP fails:');
  console.log('   - Check if server is running on 0.0.0.0 (all interfaces)');
  console.log('   - Check firewall rules for port 5000');
  console.log('   - Use localhost or 127.0.0.1 for local testing');
  console.log('2. If properties page shows blank:');
  console.log('   - Check browser console for JavaScript errors');
  console.log('   - Check if API endpoints are accessible');
  console.log('   - Ensure React app is building correctly');
}

testPropertiesPageData();
