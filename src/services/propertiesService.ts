import { Property } from '@/types/property';
import { featuredProperties, allProperties } from '@/data/properties';

// Local storage key for properties data
const STORAGE_KEY = 'real_estate_properties';
const VIEWS_STORAGE_KEY = 'property_views';

// Get properties from localStorage or initialize with default data
function getPropertiesFromStorage(): Property[] {
  if (typeof window === 'undefined') {
    // Return default data during server-side rendering
    return allProperties.map(prop => ({
      ...prop,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      viewCount: Math.floor(Math.random() * 1000)
    }));
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with all properties from the data file and add createdAt dates
      const propertiesWithDates = allProperties.map(prop => ({
        ...prop,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        viewCount: Math.floor(Math.random() * 1000)
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(propertiesWithDates));
      return propertiesWithDates;
    }
    return JSON.parse(stored, (key, value) => {
      if (key === 'createdAt' || key === 'lastViewed') return new Date(value);
      return value;
    });
  } catch (error) {
    console.error('Error getting properties from storage:', error);
    // Return default data if there's an error
    return allProperties.map(prop => ({
      ...prop,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      viewCount: Math.floor(Math.random() * 1000)
    }));
  }
}

// Function to save properties to localStorage
function savePropertiesToStorage(properties: Property[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  } catch (error) {
    console.error('Error saving properties to storage:', error);
  }
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
  try {
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
  } catch (error) {
    console.error('Error getting property stats:', error);
    return {
      total: 0,
      monthlyChange: 0,
      isPositive: true,
      totalViews: 0,
      viewsChange: 0,
      isViewsChangePositive: true
    };
  }
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
    // Return mock data during server-side rendering
    const totalViews = Math.floor(Math.random() * 10000);
    return {
      totalViews,
      lastMonthViews: Math.floor(totalViews * 0.8),
      thisMonthViews: Math.floor(totalViews * 0.2)
    };
  }
  
  try {
    const stored = localStorage.getItem(VIEWS_STORAGE_KEY);
    if (!stored) {
      const properties = await getAllProperties();
      const totalViews = properties.reduce((sum, prop) => sum + (prop.viewCount || 0), 0);
      const viewsData = {
        totalViews,
        lastMonthViews: Math.floor(totalViews * 0.8),
        thisMonthViews: Math.floor(totalViews * 0.2),
        lastUpdated: new Date()
      };
      localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(viewsData));
      return viewsData;
    }
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error getting views data:', error);
    const totalViews = Math.floor(Math.random() * 10000);
    return {
      totalViews,
      lastMonthViews: Math.floor(totalViews * 0.8),
      thisMonthViews: Math.floor(totalViews * 0.2)
    };
  }
};

// Update views data
export const updateViewsData = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  try {
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
  } catch (error) {
    console.error('Error updating views data:', error);
  }
};

// Get all properties
export const getAllProperties = async (): Promise<Property[]> => {
  try {
    return getPropertiesFromStorage();
  } catch (error) {
    console.error('Error getting all properties:', error);
    return allProperties.map(prop => ({
      ...prop,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      viewCount: Math.floor(Math.random() * 1000)
    }));
  }
};

// Get property by ID
export const getPropertyById = async (id: number | string): Promise<Property | null> => {
  try {
    const properties = await getAllProperties();
    const numId = typeof id === 'string' ? parseInt(id) : id;
    return properties.find(property => property.id === numId) || null;
  } catch (error) {
    console.error('Error getting property by ID:', error);
    return null;
  }
};

// Get properties by category
export const getPropertiesByCategory = async (category: Property['category']): Promise<Property[]> => {
  try {
    const properties = await getAllProperties();
    return properties.filter(property => property.category === category);
  } catch (error) {
    console.error('Error getting properties by category:', error);
    return [];
  }
};

// Get featured properties
export const getFeaturedProperties = async (): Promise<Property[]> => {
  try {
    const properties = await getAllProperties();
    return properties.filter(property => property.isFeatured);
  } catch (error) {
    console.error('Error getting featured properties:', error);
    return [];
  }
};

// Get properties by section (Villas & Townhouses or Apartments & Penthouses)
export const getPropertiesBySection = async (section: 'villas' | 'apartments'): Promise<Property[]> => {
  try {
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
  } catch (error) {
    console.error('Error getting properties by section:', error);
    return [];
  }
};

// Add new property
export const addProperty = async (property: Omit<Property, 'id'>): Promise<Property> => {
  try {
    const properties = await getAllProperties();
    
    // Generate a new ID
    const maxId = Math.max(...properties
      .filter(p => p.id !== undefined)
      .map(p => typeof p.id === 'string' ? parseInt(p.id) : (p.id as number)), 0);
    const newId = maxId + 1;
    
    const newProperty: Property = {
      ...property,
      id: newId,
      createdAt: new Date(),
      viewCount: 0
    };
    
    const updatedProperties = [...properties, newProperty];
    savePropertiesToStorage(updatedProperties);
    return newProperty;
  } catch (error) {
    console.error('Error adding property:', error);
    throw new Error('Failed to add property');
  }
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