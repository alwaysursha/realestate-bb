import { Property } from '@/types/property';
import { featuredProperties, allProperties } from '@/data/properties';

// Local storage key for properties data
const STORAGE_KEY = 'real_estate_properties';
const VIEWS_STORAGE_KEY = 'property_views';

// Get properties from localStorage or initialize with default data
function getPropertiesFromStorage(): Property[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('properties');
  if (!stored) {
    // Initialize with all properties from the data file and add createdAt dates
    const propertiesWithDates = allProperties.map(prop => ({
      ...prop,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date within last 30 days
      viewCount: Math.floor(Math.random() * 1000) // Initialize with random view counts
    }));
    localStorage.setItem('properties', JSON.stringify(propertiesWithDates));
    return propertiesWithDates;
  }
  return JSON.parse(stored, (key, value) => {
    if (key === 'createdAt' || key === 'lastViewed') return new Date(value);
    return value;
  });
}

// Function to save properties to localStorage
function savePropertiesToStorage(properties: Property[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('properties', JSON.stringify(properties));
}

// Calculate month-over-month change in properties
export const getPropertyStats = async (): Promise<{ 
  total: number; 
  monthlyChange: number; 
  isPositive: boolean;
  totalViews?: number;
  viewsChange?: number;
  isViewsChangePositive?: boolean;
}> => {
  const properties = await getAllProperties();
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  // Count properties created in the current month
  const currentMonthProperties = properties.filter(
    prop => prop.createdAt >= lastMonth
  ).length;

  // Count properties that existed last month
  const previousMonthProperties = properties.filter(
    prop => prop.createdAt < lastMonth
  ).length;

  // Calculate percentage change
  const change = previousMonthProperties === 0 
    ? 100 // If there were no properties last month, treat as 100% increase
    : ((currentMonthProperties / previousMonthProperties) - 1) * 100;

  // Calculate view statistics
  const totalViews = properties.reduce((sum, prop) => sum + (prop.viewCount || 0), 0);
  
  // Get views from last month for comparison
  const viewsData = await getViewsData();
  const lastMonthViews = viewsData.lastMonthViews || 0;
  
  // Calculate views change percentage
  const viewsChange = lastMonthViews === 0
    ? 100
    : ((totalViews - lastMonthViews) / lastMonthViews) * 100;

  return {
    total: properties.length,
    monthlyChange: Math.abs(Math.round(change)),
    isPositive: change >= 0,
    totalViews,
    viewsChange: Math.abs(Math.round(viewsChange)),
    isViewsChangePositive: viewsChange >= 0
  };
};

// Track a property view
export const trackPropertyView = async (id: number | string): Promise<Property | null> => {
  const properties = await getAllProperties();
  const numId = typeof id === 'string' ? parseInt(id) : id;
  const index = properties.findIndex(p => {
    const propId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
    return propId === numId;
  });
  
  if (index === -1) {
    return null;
  }
  
  // Update view count
  const property = properties[index];
  const updatedProperty = {
    ...property,
    viewCount: (property.viewCount || 0) + 1,
    lastViewed: new Date()
  };
  
  properties[index] = updatedProperty;
  savePropertiesToStorage(properties);
  
  // Update monthly views data
  updateViewsData();
  
  return updatedProperty;
};

// Get views data for statistics
export const getViewsData = async (): Promise<{
  totalViews: number;
  lastMonthViews: number;
  thisMonthViews: number;
}> => {
  if (typeof window === 'undefined') {
    return { totalViews: 0, lastMonthViews: 0, thisMonthViews: 0 };
  }
  
  const stored = localStorage.getItem(VIEWS_STORAGE_KEY);
  if (!stored) {
    const properties = await getAllProperties();
    const totalViews = properties.reduce((sum, prop) => sum + (prop.viewCount || 0), 0);
    const viewsData = {
      totalViews,
      lastMonthViews: Math.floor(totalViews * 0.8), // Simulate last month's views
      thisMonthViews: Math.floor(totalViews * 0.2), // Simulate this month's views
      lastUpdated: new Date()
    };
    localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(viewsData));
    return viewsData;
  }
  
  return JSON.parse(stored);
};

// Update views data
export const updateViewsData = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  const properties = await getAllProperties();
  const totalViews = properties.reduce((sum, prop) => sum + (prop.viewCount || 0), 0);
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Get properties viewed this month
  const thisMonthViews = properties.reduce((sum, prop) => {
    if (prop.lastViewed) {
      const viewDate = new Date(prop.lastViewed);
      if (viewDate.getMonth() === currentMonth && viewDate.getFullYear() === currentYear) {
        return sum + (prop.viewCount || 0);
      }
    }
    return sum;
  }, 0);
  
  // Calculate last month's views
  const lastMonthViews = totalViews - thisMonthViews;
  
  const viewsData = {
    totalViews,
    lastMonthViews,
    thisMonthViews,
    lastUpdated: now
  };
  
  localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(viewsData));
};

// Get all properties
export const getAllProperties = async (): Promise<Property[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getPropertiesFromStorage());
    }, 300);
  });
};

// Get property by ID
export const getPropertyById = async (id: number | string): Promise<Property | null> => {
  const properties = await getAllProperties();
  const numId = typeof id === 'string' ? parseInt(id) : id;
  return properties.find(property => property.id === numId) || null;
};

// Get properties by category
export const getPropertiesByCategory = async (category: Property['category']): Promise<Property[]> => {
  const properties = await getAllProperties();
  return properties.filter(property => property.category === category);
};

// Get featured properties
export const getFeaturedProperties = async (): Promise<Property[]> => {
  const properties = await getAllProperties();
  return properties.filter(property => property.isFeatured);
};

// Get properties by section (Villas & Townhouses or Apartments & Penthouses)
export const getPropertiesBySection = async (section: 'villas' | 'apartments'): Promise<Property[]> => {
  const properties = await getAllProperties();
  if (section === 'villas') {
    return properties.filter(property => 
      property.category === 'Villa' || 
      property.category === 'Semi' || 
      property.category === 'Townhouse'
    );
  } else {
    return properties.filter(property => 
      property.category === 'Apartment' || 
      property.category === 'Penthouse'
    );
  }
};

// Add new property
export const addProperty = async (property: Omit<Property, 'id'>): Promise<Property> => {
  const properties = await getAllProperties();
  
  // Generate a new ID
  const maxId = Math.max(...properties
    .filter(p => p.id !== undefined)
    .map(p => typeof p.id === 'string' ? parseInt(p.id) : (p.id as number)), 0);
  const newId = maxId + 1;
  
  const newProperty: Property = {
    ...property,
    id: newId,
    createdAt: new Date(), // Set creation date for new properties
    viewCount: 0 // Initialize view count
  };
  
  const updatedProperties = [...properties, newProperty];
  savePropertiesToStorage(updatedProperties);
  
  return newProperty;
};

// Update property
export const updateProperty = async (id: number | string, propertyData: Partial<Property>): Promise<Property | null> => {
  const properties = await getAllProperties();
  const numId = typeof id === 'string' ? parseInt(id) : id;
  const index = properties.findIndex(p => {
    const propId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
    return propId === numId;
  });
  
  if (index === -1) {
    return null;
  }
  
  const updatedProperty = {
    ...properties[index],
    ...propertyData
  };
  
  properties[index] = updatedProperty;
  savePropertiesToStorage(properties);
  
  return updatedProperty;
};

// Delete property
export const deleteProperty = async (id: number | string): Promise<boolean> => {
  const properties = await getAllProperties();
  const numId = typeof id === 'string' ? parseInt(id) : id;
  
  const filteredProperties = properties.filter(p => {
    const propId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
    return propId !== numId;
  });
  
  if (filteredProperties.length === properties.length) {
    return false; // No property was removed
  }
  
  savePropertiesToStorage(filteredProperties);
  return true;
};

// Reset to initial data (useful for testing)
export const resetProperties = async (): Promise<Property[]> => {
  // Add view counts to properties
  const propertiesWithViews = allProperties.map(prop => ({
    ...prop,
    viewCount: Math.floor(Math.random() * 50) + 5, // Initialize with more realistic view counts (5-55)
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) // Random date within last 30 days
  }));
  
  savePropertiesToStorage(propertiesWithViews);
  return propertiesWithViews;
};

// Compatibility functions to match the original API
// These functions are synchronous to match the original API
export function getPropertyByIdSync(id: number | string): Property | undefined {
  const numId = typeof id === 'string' ? parseInt(id) : id;
  return getPropertiesFromStorage().find(property => property.id === numId);
}

// Compatibility function for getPropertiesByCategory
export function getPropertiesByCategorySync(category: string): Property[] {
  return getPropertiesFromStorage().filter(property => property.category === category);
}

// Function to clear localStorage and reinitialize with all properties
export const clearAndReinitializeProperties = async (): Promise<Property[]> => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('properties');
    localStorage.removeItem(VIEWS_STORAGE_KEY);
  }
  return resetProperties();
}; 