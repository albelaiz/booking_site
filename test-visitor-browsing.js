// Test script to verify visitor browsing functionality
const API_BASE = 'http://localhost:5000/api';

async function testVisitorExperience() {
  console.log('🧪 Testing Visitor Experience...\n');
  
  // Test 1: Get all approved properties (no auth required)
  console.log('1️⃣ Testing public properties API...');
  try {
    const response = await fetch(`${API_BASE}/properties/public`);
    const properties = await response.json();
    
    if (response.ok && Array.isArray(properties)) {
      console.log(`✅ Success: Found ${properties.length} approved properties`);
      
      // Show first property as example
      if (properties.length > 0) {
        const firstProperty = properties[0];
        console.log(`   📍 Example: "${firstProperty.title}" in ${firstProperty.location}`);
        console.log(`   💰 Price: $${firstProperty.price}/${firstProperty.priceUnit}`);
        console.log(`   🏠 ${firstProperty.bedrooms} bed, ${firstProperty.bathrooms} bath, sleeps ${firstProperty.capacity}`);
      }
    } else {
      console.log('❌ Failed: Could not fetch properties');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('');
  
  // Test 2: Get specific property details (no auth required)
  console.log('2️⃣ Testing individual property API...');
  try {
    const response = await fetch(`${API_BASE}/properties/public/8`);
    const property = await response.json();
    
    if (response.ok && property.id) {
      console.log(`✅ Success: Retrieved property "${property.title}"`);
      console.log(`   📝 Description: ${property.description.substring(0, 80)}...`);
      console.log(`   🏷️ Amenities: ${property.amenities.slice(0, 3).join(', ')}${property.amenities.length > 3 ? '...' : ''}`);
    } else {
      console.log('❌ Failed: Could not fetch property details');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('');
  
  // Test 3: Try to access admin properties (should not work for visitors)
  console.log('3️⃣ Testing admin properties access (should fail)...');
  try {
    const response = await fetch(`${API_BASE}/properties`);
    
    if (response.ok) {
      console.log('⚠️  Warning: Visitors can access admin properties endpoint');
    } else {
      console.log('✅ Good: Admin properties endpoint is protected');
    }
  } catch (error) {
    console.log('✅ Good: Admin properties endpoint is not accessible');
  }
  
  console.log('');
  
  // Test 4: Check if featured properties are marked
  console.log('4️⃣ Testing featured properties...');
  try {
    const response = await fetch(`${API_BASE}/properties/public`);
    const properties = await response.json();
    
    if (response.ok && Array.isArray(properties)) {
      const featuredProperties = properties.filter(p => p.featured);
      console.log(`✅ Success: Found ${featuredProperties.length} featured properties`);
      
      featuredProperties.forEach(property => {
        console.log(`   ⭐ Featured: "${property.title}"`);
      });
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('');
  
  // Test 5: Verify only approved properties are returned
  console.log('5️⃣ Testing status filtering...');
  try {
    const response = await fetch(`${API_BASE}/properties/public`);
    const properties = await response.json();
    
    if (response.ok && Array.isArray(properties)) {
      const nonApprovedProperties = properties.filter(p => p.status !== 'approved');
      
      if (nonApprovedProperties.length === 0) {
        console.log('✅ Success: Only approved properties are returned to visitors');
      } else {
        console.log(`❌ Issue: Found ${nonApprovedProperties.length} non-approved properties in public API`);
      }
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n🎉 Visitor Experience Test Complete!');
}

// Run the test
testVisitorExperience().catch(console.error);
