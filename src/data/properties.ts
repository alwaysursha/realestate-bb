// Property data for the real estate website
import { Property } from '../types/property';

// Placeholder images (kept for compatibility)
export const propertyImage = '/images/property-placeholder.jpg';
export const agentImage = '/images/agent-placeholder.jpg';

// Initial properties data
export const featuredProperties: Property[] = [
  {
    id: 1,
    title: "Luxury Apartment",
    type: "Apartment",
    status: "Now Selling",
    price: 1500000,
    location: "Dubai Marina",
    city: "Dubai",
    beds: 2,
    baths: 2,
    area: 1200,
    image: "/images/properties/apartment1.jpg",
    developer: "Emaar Properties",
    yearBuilt: 2023,
    category: "Apartment",
    isFeatured: true,
    createdAt: new Date("2024-01-01"),
    description: "Luxury apartment with stunning views",
    images: ["/images/properties/apartment1.jpg"],
    coordinates: { lat: 25.080406, lng: 55.143360 }
  },
  {
    id: 2,
    title: "Beachfront Villa",
    type: "Villa",
    status: "Coming Soon",
    price: 3500000,
    location: "Palm Jumeirah",
    city: "Dubai",
    beds: 4,
    baths: 3,
    area: 2500,
    image: "/images/properties/villa1.jpg",
    developer: "Nakheel",
    yearBuilt: 2023,
    category: "Villa",
    isFeatured: true,
    createdAt: new Date("2024-01-02"),
    description: "Beautiful beachfront villa",
    images: ["/images/properties/villa1.jpg"],
    coordinates: { lat: 25.112047, lng: 55.138580 }
  },
  {
    id: 3,
    title: "Penthouse Suite",
    type: "Apartment",
    status: "Sold Out",
    price: 4200000,
    location: "Downtown Dubai",
    city: "Dubai",
    beds: 3,
    baths: 3,
    area: 4200,
    image: propertyImage,
    developer: "Emaar Properties",
    yearBuilt: 2023,
    category: "Penthouse",
    isFeatured: true,
    createdAt: new Date("2024-01-03"),
    description: "Stunning penthouse with panoramic views",
    images: [propertyImage],
    coordinates: { lat: 25.197197, lng: 55.274376 }
  },
  {
    id: 4,
    title: "Marina View Apartment",
    type: "Apartment",
    status: "Now Selling",
    price: 1800000,
    location: "Dubai Marina",
    city: "Dubai",
    beds: 2,
    baths: 2,
    area: 1400,
    image: propertyImage,
    developer: "Select Group",
    yearBuilt: 2024,
    category: "Apartment",
    isFeatured: true,
    createdAt: new Date("2024-01-04"),
    description: "Modern apartment with marina views",
    images: [propertyImage],
    coordinates: { lat: 25.078906, lng: 55.139360 }
  },
  {
    id: 5,
    title: "Business Bay Apartment",
    type: "Apartment",
    status: "Coming Soon",
    price: 2200000,
    location: "Business Bay",
    city: "Dubai",
    beds: 3,
    baths: 2,
    area: 1800,
    image: propertyImage,
    developer: "Damac Properties",
    yearBuilt: 2024,
    category: "Apartment",
    isFeatured: true,
    createdAt: new Date("2024-01-05"),
    description: "Luxurious apartment in the heart of Business Bay",
    images: [propertyImage],
    coordinates: { lat: 25.186197, lng: 55.274376 }
  },
  {
    id: 6,
    title: "JBR Beach Apartment",
    type: "Apartment",
    status: "Now Selling",
    price: 1900000,
    location: "Jumeirah Beach Residence",
    city: "Dubai",
    beds: 2,
    baths: 2,
    area: 1300,
    image: propertyImage,
    developer: "Select Group",
    yearBuilt: 2024,
    category: "Apartment",
    isFeatured: true,
    createdAt: new Date("2024-01-06"),
    description: "Beachfront apartment with stunning sea views",
    images: [propertyImage],
    coordinates: { lat: 25.078906, lng: 55.139360 }
  },
  {
    id: 7,
    title: "Dubai Hills Apartment",
    type: "Apartment",
    status: "Coming Soon",
    price: 1600000,
    location: "Dubai Hills Estate",
    city: "Dubai",
    beds: 2,
    baths: 2,
    area: 1200,
    image: propertyImage,
    developer: "Emaar Properties",
    yearBuilt: 2024,
    category: "Apartment",
    isFeatured: true,
    createdAt: new Date("2024-01-07"),
    description: "Family-friendly apartment in Dubai Hills",
    images: [propertyImage],
    coordinates: { lat: 25.097197, lng: 55.174376 }
  },
  {
    id: 8,
    title: "Emirates Hills Villa",
    type: "Villa",
    status: "Now Selling",
    price: 4500000,
    location: "Emirates Hills",
    city: "Dubai",
    beds: 5,
    baths: 4,
    area: 3500,
    image: propertyImage,
    developer: "Emaar Properties",
    yearBuilt: 2024,
    category: "Villa",
    isFeatured: true,
    createdAt: new Date("2024-01-08"),
    description: "Luxury villa in prestigious Emirates Hills",
    images: [propertyImage],
    coordinates: { lat: 25.097197, lng: 55.174376 }
  },
  {
    id: 9,
    title: "Arabian Ranches Villa",
    type: "Villa",
    status: "Coming Soon",
    price: 3800000,
    location: "Arabian Ranches",
    city: "Dubai",
    beds: 4,
    baths: 3,
    area: 2800,
    image: propertyImage,
    developer: "Emaar Properties",
    yearBuilt: 2024,
    category: "Villa",
    isFeatured: true,
    createdAt: new Date("2024-01-09"),
    description: "Spacious villa in family-friendly Arabian Ranches",
    images: [propertyImage],
    coordinates: { lat: 25.097197, lng: 55.174376 }
  },
  {
    id: 10,
    title: "Dubai Hills Townhouse",
    type: "Townhouse",
    status: "Now Selling",
    price: 2800000,
    location: "Dubai Hills Estate",
    city: "Dubai",
    beds: 3,
    baths: 2,
    area: 2200,
    image: propertyImage,
    developer: "Emaar Properties",
    yearBuilt: 2024,
    category: "Townhouse",
    isFeatured: true,
    createdAt: new Date("2024-01-10"),
    description: "Modern townhouse in Dubai Hills Estate",
    images: [propertyImage],
    coordinates: { lat: 25.097197, lng: 55.174376 }
  },
  {
    id: 11,
    title: "Mudon Townhouse",
    type: "Townhouse",
    status: "Coming Soon",
    price: 2500000,
    location: "Mudon",
    city: "Dubai",
    beds: 3,
    baths: 2,
    area: 2000,
    image: propertyImage,
    developer: "Meraas",
    yearBuilt: 2024,
    category: "Townhouse",
    isFeatured: true,
    createdAt: new Date("2024-01-11"),
    description: "Contemporary townhouse in Mudon community",
    images: [propertyImage],
    coordinates: { lat: 25.097197, lng: 55.174376 }
  }
];

// Export all properties (combining all categories)
export const allProperties: Property[] = [...featuredProperties];

// Helper function to get properties by category
export const getPropertiesByCategory = (category: string): Property[] => {
  return allProperties.filter(property => 
    property.type?.toLowerCase() === category.toLowerCase() ||
    property.propertyType?.toLowerCase() === category.toLowerCase() ||
    property.category?.toLowerCase() === category.toLowerCase()
  );
};

// Helper function to get a property by ID
export const getPropertyById = (id: string | number): Property | undefined => {
  return allProperties.find(property => 
    property.id !== undefined && property.id.toString() === id.toString()
  );
};

// Helper function to get properties by status
export const getPropertiesByStatus = (status: string): Property[] => {
  return allProperties.filter(property => 
    property.status.toLowerCase() === status.toLowerCase()
  );
};

// Helper function to get properties by location
export const getPropertiesByLocation = (location: string): Property[] => {
  return allProperties.filter(property => 
    property.location.toLowerCase().includes(location.toLowerCase())
  );
}; 