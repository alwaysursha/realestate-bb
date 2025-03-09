import { Developer } from '@/types/developer';

// Sample developers data
const sampleDevelopers: Developer[] = [
  {
    id: "1",
    name: "Emaar Properties",
    description: "Leading developer in Dubai known for iconic projects like Burj Khalifa",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Emaar_Properties_logo.svg/1200px-Emaar_Properties_logo.svg.png",
    website: "https://www.emaar.com",
    email: "info@emaar.com",
    phone: "+971 4 888 8888",
    address: "Dubai, UAE",
    establishedYear: 1997,
    projects: ["proj1", "proj2", "proj3"],
    featured: true,
    slug: "emaar-properties",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-06-15")
  },
  {
    id: "2",
    name: "Nakheel",
    description: "Developer behind Palm Jumeirah and other iconic Dubai projects",
    logo: "https://www.nakheel.com/en/assets/nakheel-logo.png",
    website: "https://www.nakheel.com",
    email: "info@nakheel.com",
    phone: "+971 4 390 3333",
    address: "Dubai, UAE",
    establishedYear: 2000,
    projects: ["proj4", "proj5"],
    featured: true,
    slug: "nakheel",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-07-20")
  }
];

const DEVELOPERS_STORAGE_KEY = 'real_estate_developers';

// Get developers from storage or initialize with sample data
const getDevelopersFromStorage = (): Developer[] => {
  if (typeof window === 'undefined') return sampleDevelopers;
  
  const stored = localStorage.getItem(DEVELOPERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(DEVELOPERS_STORAGE_KEY, JSON.stringify(sampleDevelopers));
    return sampleDevelopers;
  }
  
  return JSON.parse(stored);
};

// Save developers to storage
const saveDevelopersToStorage = (developers: Developer[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEVELOPERS_STORAGE_KEY, JSON.stringify(developers));
};

// Add a new developer
export const addDeveloper = async (developer: Developer, logoFile?: File): Promise<string> => {
  const developers = getDevelopersFromStorage();
  
  const newDeveloper: Developer = {
    ...developer,
    id: Math.random().toString(36).substring(2, 15),
    slug: generateSlug(developer.name),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  developers.push(newDeveloper);
  saveDevelopersToStorage(developers);
  
  return newDeveloper.id || '';
};

// Update a developer
export const updateDeveloper = async (
  id: string, 
  developer: Partial<Developer>, 
  logoFile?: File, 
  deleteCurrentLogo: boolean = false
): Promise<void> => {
  const developers = getDevelopersFromStorage();
  const index = developers.findIndex(d => d.id === id);
  
  if (index === -1) {
    throw new Error("Developer not found");
  }
  
  const updatedDeveloper = {
    ...developers[index],
    ...developer,
    slug: developer.name ? generateSlug(developer.name) : developers[index].slug,
    updatedAt: new Date()
  };
  
  developers[index] = updatedDeveloper;
  saveDevelopersToStorage(developers);
};

// Delete a developer
export const deleteDeveloper = async (id: string): Promise<void> => {
  const developers = getDevelopersFromStorage();
  const index = developers.findIndex(d => d.id === id);
  
  if (index === -1) {
    throw new Error("Developer not found");
  }
  
  developers.splice(index, 1);
  saveDevelopersToStorage(developers);
};

// Get a developer by ID
export const getDeveloperById = async (id: string): Promise<Developer | null> => {
  const developers = getDevelopersFromStorage();
  return developers.find(d => d.id === id) || null;
};

// Get a developer by slug
export const getDeveloperBySlug = async (slug: string): Promise<Developer | null> => {
  const developers = getDevelopersFromStorage();
  return developers.find(d => d.slug === slug) || null;
};

// Get all developers with pagination
export const getDevelopers = async (
  pageSize: number = 10, 
  lastVisible?: any,
  filters?: {
    featured?: boolean;
  }
): Promise<{ developers: Developer[]; lastVisible: any }> => {
  const allDevelopers = getDevelopersFromStorage();
  
  // Apply filters
  let filteredDevelopers = [...allDevelopers];
  
  if (filters?.featured !== undefined) {
    filteredDevelopers = filteredDevelopers.filter(d => d.featured === filters.featured);
  }
  
  // Sort by createdAt
  filteredDevelopers.sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Apply pagination
  const startIndex = lastVisible ? allDevelopers.findIndex(d => d.id === lastVisible.id) + 1 : 0;
  const paginatedDevelopers = filteredDevelopers.slice(startIndex, startIndex + pageSize);
  
  const newLastVisible = paginatedDevelopers.length > 0 
    ? paginatedDevelopers[paginatedDevelopers.length - 1] 
    : null;
  
  return { developers: paginatedDevelopers, lastVisible: newLastVisible };
};

// Add project to developer
export const addProjectToDeveloper = async (developerId: string, projectId: string): Promise<Developer | null> => {
  const developers = getDevelopersFromStorage();
  const index = developers.findIndex(d => d.id === developerId);
  
  if (index === -1) {
    return null;
  }
  
  const developer = developers[index];
  
  if (!developer.projects || !developer.projects.includes(projectId)) {
    developer.projects = [...(developer.projects || []), projectId];
    developer.updatedAt = new Date();
    
    developers[index] = developer;
    saveDevelopersToStorage(developers);
  }
  
  return developer;
};

// Remove project from developer
export const removeProjectFromDeveloper = async (developerId: string, projectId: string): Promise<Developer | null> => {
  const developers = getDevelopersFromStorage();
  const index = developers.findIndex(d => d.id === developerId);
  
  if (index === -1) {
    return null;
  }
  
  const developer = developers[index];
  
  developer.projects = developer.projects?.filter(id => id !== projectId) || [];
  developer.updatedAt = new Date();
  
  developers[index] = developer;
  saveDevelopersToStorage(developers);
  
  return developer;
};

// Helper function to generate a slug from a name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}; 