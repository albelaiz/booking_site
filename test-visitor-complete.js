/**
 * Complete Visitor Experience Enhancement Script
 * This script tests all visitor-facing features and identifies improvements
 */

// Test navigation and page loading
async function testPageNavigation() {
  console.log('🧭 Testing Page Navigation...');
  
  const pages = [
    { name: 'Homepage', url: '/' },
    { name: 'Properties', url: '/properties' },
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' },
    { name: 'Become Host', url: '/become-host' }
  ];
  
  for (const page of pages) {
    try {
      const response = await fetch(`http://localhost:5000${page.url}`);
      const status = response.ok ? '✅' : '❌';
      console.log(`${status} ${page.name} (${page.url}) - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${page.name} - Error: ${error.message}`);
    }
  }
}

// Test search functionality
async function testSearchFunctionality() {
  console.log('\n🔍 Testing Search Functionality...');
  
  const searchQueries = [
    { location: 'martil', guests: 2 },
    { location: 'tetouan', guests: 4 },
    { location: 'atlas', guests: 1 }
  ];
  
  for (const query of searchQueries) {
    try {
      const params = new URLSearchParams();
      params.set('location', query.location);
      params.set('guests', query.guests.toString());
      
      const response = await fetch(`http://localhost:5000/api/properties?${params}`);
      if (response.ok) {
        const properties = await response.json();
        console.log(`✅ Search for "${query.location}" (${query.guests} guests): ${properties.length} results`);
      } else {
        console.log(`❌ Search for "${query.location}" failed: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Search error for "${query.location}": ${error.message}`);
    }
  }
}

// Test booking system
async function testBookingSystem() {
  console.log('\n📅 Testing Booking System...');
  
  try {
    // Test booking creation
    const bookingData = {
      propertyId: 1,
      guestName: 'Test Visitor',
      guestEmail: 'visitor@example.com',
      guestPhone: '+1234567890',
      checkIn: '2025-08-01',
      checkOut: '2025-08-05',
      guests: 2,
      amount: 800,
      comments: 'Test booking from visitor experience test'
    };
    
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (response.ok) {
      console.log('✅ Booking creation endpoint working');
      const booking = await response.json();
      console.log(`   Booking ID: ${booking.id || 'Generated'}`);
    } else {
      console.log(`❌ Booking creation failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Booking system error: ${error.message}`);
  }
}

// Test user registration flow
async function testUserRegistration() {
  console.log('\n👤 Testing User Registration...');
  
  const newUser = {
    username: `visitor_${Date.now()}`,
    email: `visitor${Date.now()}@test.com`,
    password: 'SecurePassword123!',
    name: 'Test Visitor',
    phone: '+1234567890'
  };
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    
    if (response.ok || response.status === 409) {
      console.log('✅ Registration system working');
      
      // Test login with the same user
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password
        }),
      });
      
      if (loginResponse.ok) {
        console.log('✅ Login system working');
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log(`❌ Registration failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ User registration error: ${error.message}`);
  }
}

// Test property details
async function testPropertyDetails() {
  console.log('\n🏠 Testing Property Details...');
  
  try {
    // First get list of properties
    const propertiesResponse = await fetch('http://localhost:5000/api/properties');
    if (propertiesResponse.ok) {
      const properties = await response.json();
      
      if (properties.length > 0) {
        const firstProperty = properties[0];
        console.log(`✅ Property loaded: ${firstProperty.title}`);
        console.log(`   📍 Location: ${firstProperty.location}`);
        console.log(`   💰 Price: $${firstProperty.price}/${firstProperty.priceUnit}`);
        console.log(`   👥 Capacity: ${firstProperty.capacity} guests`);
        
        // Test availability check
        const availabilityResponse = await fetch(
          `http://localhost:5000/api/properties/${firstProperty.id}/availability?checkIn=2025-08-01&checkOut=2025-08-05`
        );
        
        if (availabilityResponse.ok) {
          console.log('✅ Availability check working');
        } else {
          console.log('❌ Availability check failed');
        }
      }
    }
  } catch (error) {
    console.log(`❌ Property details error: ${error.message}`);
  }
}

// Test contact form
async function testContactForm() {
  console.log('\n📧 Testing Contact Form...');
  
  const contactData = {
    name: 'Test Visitor',
    email: 'visitor@test.com',
    subject: 'Test Contact Form',
    message: 'This is a test message from the visitor experience test.'
  };
  
  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    
    if (response.ok) {
      console.log('✅ Contact form working');
    } else {
      console.log(`❌ Contact form failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Contact form error: ${error.message}`);
  }
}

// Main test runner
async function runVisitorExperienceTests() {
  console.log('🎯 Running Complete Visitor Experience Tests...\n');
  console.log('=' + '='.repeat(50));
  
  await testPageNavigation();
  await testSearchFunctionality();
  await testBookingSystem();
  await testUserRegistration();
  await testPropertyDetails();
  await testContactForm();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Visitor Experience Test Complete!');
  console.log('\n💡 Recommendations for improvement:');
  console.log('1. ✨ Add loading spinners for better user feedback');
  console.log('2. 🔔 Implement toast notifications for actions');
  console.log('3. 📱 Ensure all components are mobile-responsive');
  console.log('4. 🎨 Add smooth transitions and animations');
  console.log('5. ♿ Improve accessibility with ARIA labels');
  console.log('6. 🔒 Add form validation feedback');
  console.log('7. 🖼️ Optimize images for faster loading');
  console.log('8. 🌐 Add internationalization support');
  console.log('9. 📊 Implement analytics tracking');
  console.log('10. 🔍 Add advanced search filters');
}

// Run the tests
runVisitorExperienceTests().catch(console.error);
