
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: 'night' | 'week' | 'month';
  images: string[];
  location: string;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  amenities: string[];
  featured: boolean;
  rating: number; // Add the missing rating property
  reviews: number; // Add the missing reviews property
  ownerId?: string; // ID of the property owner
  status?: 'pending' | 'approved' | 'rejected'; // Moderation status
  createdAt?: string; // When the property was first listed
  updatedAt?: string; // When the property was last updated
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Luxury Villa with Ocean View",
    description: "Experience the ultimate in Mediterranean luxury with this stunning villa overlooking the beautiful beaches of Martil. This spacious property features elegant Moroccan design elements, a private garden with palm trees, and panoramic views of the Mediterranean. Perfect for families or groups seeking a premium coastal getaway.",
    price: 2500,
    priceUnit: "night",
    location: "Beachfront, Martil",
    bedrooms: 5,
    bathrooms: 4,
    capacity: 10,
    amenities: ["Private Pool", "Ocean View", "Air Conditioning", "Free WiFi", "Full Kitchen", "Terrace", "Garden", "BBQ Area", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    featured: true,
    rating: 4.9,
    reviews: 43
  },
  {
    id: "2",
    title: "Traditional Moroccan Riad",
    description: "Step into authentic Moroccan living in this beautifully restored traditional riad. Located just minutes from the beach, this property combines traditional architecture with modern comforts. Featuring a central courtyard with fountain, intricate tilework, and hand-carved details throughout.",
    price: 1800,
    priceUnit: "night",
    location: "Old Town, Martil",
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    amenities: ["Courtyard", "Rooftop Terrace", "Air Conditioning", "Free WiFi", "Traditional Hammam", "Kitchen", "Daily Cleaning Service"],
    images: [
      "https://images.unsplash.com/photo-1577494203325-75bfe896a9cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1531835551805-16d864c8d311?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    featured: true,
    rating: 4.8,
    reviews: 36
  },
  {
    id: "3",
    title: "Modern Beachside Apartment",
    description: "Perfect for couples or small families, this modern apartment offers stunning sea views from its large private balcony. Recently renovated with stylish furnishings while maintaining Moroccan design touches. Just steps from the beach and local restaurants.",
    price: 850,
    priceUnit: "night",
    location: "Central Beach Area, Martil",
    bedrooms: 2,
    bathrooms: 1,
    capacity: 4,
    amenities: ["Sea View", "Balcony", "Air Conditioning", "Free WiFi", "Fully Equipped Kitchen", "24h Security", "Elevator"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    featured: true,
    rating: 4.7,
    reviews: 29
  },
  {
    id: "4",
    title: "Family Beach House",
    description: "This spacious beach house is perfect for large families or groups. With direct beach access and a large garden, this property offers plenty of space to relax and enjoy the Martil sunshine. The interior features traditional Moroccan decor with all modern amenities.",
    price: 1950,
    priceUnit: "night",
    location: "Eastern Beach, Martil",
    bedrooms: 4,
    bathrooms: 3,
    capacity: 9,
    amenities: ["Beach Access", "Garden", "Outdoor Dining Area", "Air Conditioning", "Free WiFi", "Full Kitchen", "Washing Machine", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1507149833265-60c372daea22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80"
    ],
    featured: false,
    rating: 4.6,
    reviews: 22
  },
  {
    id: "5",
    title: "Cozy Studio Near the Medina",
    description: "This charming studio apartment offers an authentic Moroccan experience near Martil's vibrant medina. Perfect for travelers looking to immerse themselves in local culture while enjoying modern comforts. Beautifully decorated with traditional Moroccan furnishings and textiles.",
    price: 600,
    priceUnit: "night",
    location: "Medina Quarter, Martil",
    bedrooms: 1,
    bathrooms: 1,
    capacity: 2,
    amenities: ["Air Conditioning", "Free WiFi", "Kitchenette", "Rooftop Access", "Walking Distance to Beach", "Local Guide Available"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1495433324511-bf8e92934d90?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    featured: false,
    rating: 4.5,
    reviews: 18
  },
  {
    id: "6",
    title: "Hillside Villa with Private Pool",
    description: "Experience true luxury in this stunning hillside villa with spectacular views of Martil Bay. This secluded property offers privacy and tranquility while being just a short drive from the beach and town center. The expansive outdoor area features a private infinity pool overlooking the Mediterranean.",
    price: 3200,
    priceUnit: "night",
    location: "Hillside, Martil",
    bedrooms: 6,
    bathrooms: 5,
    capacity: 12,
    amenities: ["Private Infinity Pool", "Panoramic Views", "Outdoor Dining", "Air Conditioning", "Free WiFi", "Full Kitchen", "Garden", "BBQ Area", "Parking", "Security System"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    featured: true,
    rating: 5.0,
    reviews: 31
  }
];
