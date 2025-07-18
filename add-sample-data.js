// Quick script to add sample properties
const sampleProperties = [
  {
    title: "Luxury Villa in Martil",
    description: "A stunning luxury villa with panoramic sea views",
    price: "250",
    location: "Martil Beach, Morocco",
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    featured: true,
    status: "approved",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6"],
    amenities: ["WiFi", "Beach Access", "Pool", "Kitchen"]
  },
  {
    title: "Cozy Riad in Tétouan",
    description: "Traditional Moroccan riad with authentic architecture",
    price: "120",
    location: "Tétouan Medina, Morocco",
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    featured: false,
    status: "approved",
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
    amenities: ["WiFi", "Traditional Architecture", "Rooftop Terrace"]
  },
  {
    title: "Modern Apartment with Sea View",
    description: "Contemporary apartment with breathtaking sea views",
    price: "180",
    location: "Martil Seafront, Morocco",
    bedrooms: 2,
    bathrooms: 1,
    capacity: 4,
    featured: true,
    status: "approved",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
    amenities: ["WiFi", "Sea View", "Balcony", "Kitchen"]
  }
];

console.log("Sample properties created. Copy these to your admin panel:");
console.log(JSON.stringify(sampleProperties, null, 2));
