import { storage } from "./storage.js";

export async function addSampleProperties() {
  try {
    console.log("Adding sample approved properties...");
    
    // Get the owner user
    const allUsers = await storage.getAllUsers();
    const ownerUser = allUsers.find(u => u.role === 'owner');
    
    if (!ownerUser) {
      console.log("No owner user found! Creating one...");
      const newOwner = await storage.createUser({
        username: "owner",
        password: "password123",
        role: "owner",
        name: "Property Owner",
        email: "owner@bluebay.com",
        status: "active"
      });
      
      const ownerId = newOwner.id;
      
      // Create sample approved properties
      const sampleProperties = [
        {
          title: "Luxury Villa in Martil",
          description: "A stunning luxury villa with panoramic sea views, perfect for families and groups. Features modern amenities, private garden, and direct beach access.",
          price: "250.00",
          priceUnit: "night",
          images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6"],
          location: "Martil Beach, Morocco",
          bedrooms: 4,
          bathrooms: 3,
          capacity: 8,
          amenities: ["WiFi", "Beach Access", "Private Garden", "Pool", "Air Conditioning", "Kitchen", "Parking"],
          featured: true,
          ownerId: ownerId,
          status: "approved"
        },
        {
          title: "Cozy Riad in Tétouan",
          description: "Traditional Moroccan riad with authentic architecture and modern comfort. Located in the heart of Tétouan's medina.",
          price: "120.00",
          priceUnit: "night", 
          images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
          location: "Tétouan Medina, Morocco",
          bedrooms: 3,
          bathrooms: 2,
          capacity: 6,
          amenities: ["WiFi", "Traditional Architecture", "Rooftop Terrace", "Kitchen", "Air Conditioning"],
          featured: false,
          ownerId: ownerId,
          status: "approved"
        },
        {
          title: "Modern Apartment with Sea View",
          description: "Contemporary apartment with breathtaking sea views. Ideal for couples seeking a romantic getaway.",
          price: "180.00",
          priceUnit: "night",
          images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
          location: "Martil Seafront, Morocco",
          bedrooms: 2,
          bathrooms: 1,
          capacity: 4,
          amenities: ["WiFi", "Sea View", "Balcony", "Kitchen", "Air Conditioning", "Beach Access"],
          featured: true,
          ownerId: ownerId,
          status: "approved"
        },
        {
          title: "Family Beach House",
          description: "Spacious beach house perfect for family vacations. Features a large terrace and is just steps from the beach.",
          price: "200.00",
          priceUnit: "night",
          images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2"],
          location: "Cabo Negro Beach, Morocco", 
          bedrooms: 3,
          bathrooms: 2,
          capacity: 6,
          amenities: ["WiFi", "Beach Access", "Terrace", "BBQ Area", "Kitchen", "Parking"],
          featured: false,
          ownerId: ownerId,
          status: "approved"
        },
        {
          title: "Mountain View Chalet",
          description: "Peaceful chalet with stunning mountain views, perfect for nature lovers seeking tranquility.",
          price: "150.00",
          priceUnit: "night",
          images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4"],
          location: "Rif Mountains, Morocco",
          bedrooms: 2,
          bathrooms: 1,
          capacity: 4,
          amenities: ["WiFi", "Mountain View", "Fireplace", "Kitchen", "Hiking Trails", "Garden"],
          featured: false,
          ownerId: ownerId,
          status: "approved"
        }
      ];

      for (const property of sampleProperties) {
        try {
          const newProperty = await storage.createProperty(property);
          console.log(`✅ Created approved property: ${property.title} (ID: ${newProperty.id})`);
        } catch (error) {
          console.log(`❌ Error creating property ${property.title}:`, error);
        }
      }
    } else {
      const ownerId = ownerUser.id;
      
      // Create sample approved properties
      const sampleProperties = [
        {
          title: "Luxury Villa in Martil",
          description: "A stunning luxury villa with panoramic sea views, perfect for families and groups. Features modern amenities, private garden, and direct beach access.",
          price: "250.00",
          priceUnit: "night",
          images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6"],
          location: "Martil Beach, Morocco",
          bedrooms: 4,
          bathrooms: 3,
          capacity: 8,
          amenities: ["WiFi", "Beach Access", "Private Garden", "Pool", "Air Conditioning", "Kitchen", "Parking"],
          featured: true,
          ownerId: ownerId,
          status: "approved"
        },
        {
          title: "Cozy Riad in Tétouan",
          description: "Traditional Moroccan riad with authentic architecture and modern comfort. Located in the heart of Tétouan's medina.",
          price: "120.00",
          priceUnit: "night", 
          images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
          location: "Tétouan Medina, Morocco",
          bedrooms: 3,
          bathrooms: 2,
          capacity: 6,
          amenities: ["WiFi", "Traditional Architecture", "Rooftop Terrace", "Kitchen", "Air Conditioning"],
          featured: false,
          ownerId: ownerId,
          status: "approved"
        },
        {
          title: "Modern Apartment with Sea View",
          description: "Contemporary apartment with breathtaking sea views. Ideal for couples seeking a romantic getaway.",
          price: "180.00",
          priceUnit: "night",
          images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
          location: "Martil Seafront, Morocco",
          bedrooms: 2,
          bathrooms: 1,
          capacity: 4,
          amenities: ["WiFi", "Sea View", "Balcony", "Kitchen", "Air Conditioning", "Beach Access"],
          featured: true,
          ownerId: ownerId,
          status: "approved"
        },
        {
          title: "Family Beach House",
          description: "Spacious beach house perfect for family vacations. Features a large terrace and is just steps from the beach.",
          price: "200.00",
          priceUnit: "night",
          images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2"],
          location: "Cabo Negro Beach, Morocco", 
          bedrooms: 3,
          bathrooms: 2,
          capacity: 6,
          amenities: ["WiFi", "Beach Access", "Terrace", "BBQ Area", "Kitchen", "Parking"],
          featured: false,
          ownerId: ownerId,
          status: "approved"
        },
        {
          title: "Mountain View Chalet",
          description: "Peaceful chalet with stunning mountain views, perfect for nature lovers seeking tranquility.",
          price: "150.00",
          priceUnit: "night",
          images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4"],
          location: "Rif Mountains, Morocco",
          bedrooms: 2,
          bathrooms: 1,
          capacity: 4,
          amenities: ["WiFi", "Mountain View", "Fireplace", "Kitchen", "Hiking Trails", "Garden"],
          featured: false,
          ownerId: ownerId,
          status: "approved"
        }
      ];

      for (const property of sampleProperties) {
        try {
          const newProperty = await storage.createProperty(property);
          console.log(`✅ Created approved property: ${property.title} (ID: ${newProperty.id})`);
        } catch (error) {
          console.log(`❌ Error creating property ${property.title}:`, error);
        }
      }
    }

    console.log("🎉 Sample properties added successfully!");
  } catch (error) {
    console.error("❌ Error adding sample properties:", error);
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addSampleProperties().then(() => {
    console.log("Done!");
    process.exit(0);
  });
}
