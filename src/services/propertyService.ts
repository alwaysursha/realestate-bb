import { Property } from '@/types/property';

// Sample properties data
const sampleProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Villa in Palm Jumeirah",
    description: "Beautiful 5-bedroom villa with private beach access",
    price: 15000000,
    location: "Palm Jumeirah, Dubai",
    bedrooms: 5,
    bathrooms: 6,
    area: 10000,
    propertyType: "Villa",
    status: "For Sale",
    features: ["Private Pool", "Beach Access", "Smart Home", "Gym"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1475&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    ],
    developerId: "1",
    developerName: "Emaar Properties",
    featured: true,
    slug: "luxury-villa-palm-jumeirah",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20")
  },
  {
    id: "2",
    title: "Modern Apartment in Downtown Dubai",
    description: "Spacious 2-bedroom apartment with Burj Khalifa view",
    price: 3500000,
    location: "Downtown Dubai",
    bedrooms: 2,
    bathrooms: 2.5,
    area: 1200,
    propertyType: "Apartment",
    status: "For Sale",
    features: ["Burj Khalifa View", "Gym", "Swimming Pool", "24/7 Security"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80"
    ],
    developerId: "1",
    developerName: "Emaar Properties",
    agentId: "1",
    agentName: "John Smith",
    featured: false,
    slug: "modern-apartment-downtown-dubai",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-07-05")
  }
];

const PROPERTIES_STORAGE_KEY = 'real_estate_properties';

// Get properties from storage or initialize with sample data
const getPropertiesFromStorage = (): Property[] => {
  if (typeof window === 'undefined') return sampleProperties;
  
  const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(sampleProperties));
    return sampleProperties;
  }
  
  return JSON.parse(stored);
};

// Save properties to storage
const savePropertiesToStorage = (properties: Property[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(properties));
};

// Add a new property
export const addProperty = async (property: Property, imageFiles?: File[]): Promise<string> => {
  const properties = getPropertiesFromStorage();
  
  const newProperty: Property = {
    ...property,
    id: Math.random().toString(36).substring(2, 15),
    slug: generateSlug(property.title),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  properties.push(newProperty);
  savePropertiesToStorage(properties);
  
  return typeof newProperty.id === 'string' ? newProperty.id : newProperty.id?.toString() || '';
};

// Update a property
export const updateProperty = async (
  id: string, 
  property: Partial<Property>, 
  imageFiles?: File[], 
  imagesToDelete?: string[]
): Promise<void> => {
  const properties = getPropertiesFromStorage();
  const index = properties.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new Error("Property not found");
  }
  
  // Handle image deletion
  let updatedImages = [...properties[index].images];
  if (imagesToDelete && imagesToDelete.length > 0) {
    updatedImages = updatedImages.filter(img => !imagesToDelete.includes(img));
  }
  
  const updatedProperty = {
    ...properties[index],
    ...property,
    images: updatedImages,
    slug: property.title ? generateSlug(property.title) : properties[index].slug,
    updatedAt: new Date()
  };
  
  properties[index] = updatedProperty;
  savePropertiesToStorage(properties);
};

// Delete a property
export const deleteProperty = async (id: string): Promise<void> => {
  const properties = getPropertiesFromStorage();
  const index = properties.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new Error("Property not found");
  }
  
  properties.splice(index, 1);
  savePropertiesToStorage(properties);
};

// Get a property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  const properties = getPropertiesFromStorage();
  return properties.find(p => p.id === id) || null;
};

// Get all properties with pagination
export const getProperties = async (
  pageSize: number = 10, 
  lastVisible?: any,
  filters?: {
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    location?: string;
    featured?: boolean;
    developerId?: string;
    agentId?: string;
  }
): Promise<{ properties: Property[]; lastVisible: any }> => {
  const allProperties = getPropertiesFromStorage();
  
  // Apply filters
  let filteredProperties = [...allProperties];
  
  if (filters) {
    if (filters.propertyType) {
      filteredProperties = filteredProperties.filter(p => p.propertyType === filters.propertyType);
    }
    
    if (filters.minPrice !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms === filters.bedrooms);
    }
    
    if (filters.location) {
      const locationFilter = filters.location;
      filteredProperties = filteredProperties.filter(p => p.location.includes(locationFilter));
    }
    
    if (filters.featured !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.featured === filters.featured);
    }
    
    if (filters.developerId) {
      filteredProperties = filteredProperties.filter(p => p.developerId === filters.developerId);
    }
    
    if (filters.agentId) {
      filteredProperties = filteredProperties.filter(p => p.agentId === filters.agentId);
    }
  }
  
  // Sort by createdAt
  filteredProperties.sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Apply pagination
  const startIndex = lastVisible ? allProperties.findIndex(p => p.id === lastVisible.id) + 1 : 0;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + pageSize);
  
  const newLastVisible = paginatedProperties.length > 0 
    ? paginatedProperties[paginatedProperties.length - 1] 
    : null;
  
  return { properties: paginatedProperties, lastVisible: newLastVisible };
};

// Helper function to generate a slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}; 