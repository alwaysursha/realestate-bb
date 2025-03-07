import { developers as initialDevelopers, Developer } from '@/data/developers';

// Local storage key for developers data
const STORAGE_KEY = 'real_estate_developers';

// Function to get developers from localStorage or initial data
const getDevelopersFromStorage = (): Developer[] => {
  if (typeof window === 'undefined') {
    return initialDevelopers; // Return initial data on server-side
  }
  
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error reading developers from localStorage:', error);
  }
  
  // If no data in localStorage or error occurred, save initial data and return it
  saveDevelopersToStorage(initialDevelopers);
  return initialDevelopers;
};

// Function to save developers to localStorage
const saveDevelopersToStorage = (developers: Developer[]): void => {
  if (typeof window === 'undefined') {
    return; // Don't attempt to save on server-side
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(developers));
  } catch (error) {
    console.error('Error saving developers to localStorage:', error);
  }
};

// Get all developers
export const getAllDevelopers = async (): Promise<Developer[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getDevelopersFromStorage());
    }, 300);
  });
};

// Get active developers
export const getActiveDevelopers = async (): Promise<Developer[]> => {
  const developers = await getAllDevelopers();
  return developers.filter(dev => dev.status === 'active');
};

// Get developer by ID
export const getDeveloperById = async (id: string): Promise<Developer | null> => {
  const developers = await getAllDevelopers();
  return developers.find(dev => dev.id === id) || null;
};

// Get developer by slug
export const getDeveloperBySlug = async (slug: string): Promise<Developer | null> => {
  const developers = await getAllDevelopers();
  return developers.find(dev => dev.slug === slug) || null;
};

// Add new developer
export const addDeveloper = async (developer: Omit<Developer, 'id'>): Promise<Developer> => {
  const developers = await getAllDevelopers();
  
  // Generate a new ID
  const newId = (Math.max(...developers.map(d => parseInt(d.id)), 0) + 1).toString();
  
  const newDeveloper: Developer = {
    ...developer,
    id: newId
  };
  
  const updatedDevelopers = [...developers, newDeveloper];
  saveDevelopersToStorage(updatedDevelopers);
  
  return newDeveloper;
};

// Update developer
export const updateDeveloper = async (id: string, developerData: Partial<Developer>): Promise<Developer | null> => {
  const developers = await getAllDevelopers();
  const index = developers.findIndex(dev => dev.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedDeveloper = {
    ...developers[index],
    ...developerData
  };
  
  developers[index] = updatedDeveloper;
  saveDevelopersToStorage(developers);
  
  return updatedDeveloper;
};

// Delete developer
export const deleteDeveloper = async (id: string): Promise<boolean> => {
  const developers = await getAllDevelopers();
  const filteredDevelopers = developers.filter(dev => dev.id !== id);
  
  if (filteredDevelopers.length === developers.length) {
    return false; // No developer was removed
  }
  
  saveDevelopersToStorage(filteredDevelopers);
  return true;
};

// Reset to initial data (useful for testing)
export const resetDevelopers = async (): Promise<Developer[]> => {
  saveDevelopersToStorage(initialDevelopers);
  return initialDevelopers;
}; 