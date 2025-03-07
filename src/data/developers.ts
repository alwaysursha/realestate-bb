export interface Developer {
  id: string;
  name: string;
  logo: string;
  description: string;
  projectCount: number;
  establishedYear: number;
  slug: string;
  status: 'active' | 'inactive';
}

// This is the single source of truth for developers data
export const developers: Developer[] = [
  {
    id: '1',
    name: 'Emaar Properties',
    logo: '/images/developers/emaar.png',
    description: 'One of the largest real estate developers in the UAE known for iconic projects like Burj Khalifa and Dubai Mall.',
    projectCount: 42,
    establishedYear: 1997,
    slug: 'emaar-properties',
    status: 'active'
  },
  {
    id: '2',
    name: 'Nakheel',
    logo: '/images/developers/nakheel.png',
    description: 'Developer behind Palm Jumeirah and other iconic Dubai landmarks and waterfront projects.',
    projectCount: 35,
    establishedYear: 2000,
    slug: 'nakheel',
    status: 'active'
  },
  {
    id: '3',
    name: 'Dubai Properties',
    logo: '/images/developers/dubai-properties.png',
    description: 'Leading developer of unique destinations and communities across Dubai.',
    projectCount: 28,
    establishedYear: 2004,
    slug: 'dubai-properties',
    status: 'active'
  },
  {
    id: '4',
    name: 'Damac Properties',
    logo: '/images/developers/damac.png',
    description: 'Luxury developer known for partnerships with fashion brands like Versace and Cavalli.',
    projectCount: 33,
    establishedYear: 2002,
    slug: 'damac-properties',
    status: 'active'
  },
  {
    id: '5',
    name: 'Meraas',
    logo: '/images/developers/meraas.png',
    description: 'Developer focused on creating unique experiences through lifestyle destinations.',
    projectCount: 20,
    establishedYear: 2007,
    slug: 'meraas',
    status: 'active'
  },
  {
    id: '6',
    name: 'Sobha Realty',
    logo: '/images/developers/sobha.png',
    description: 'Premium developer known for high-quality craftsmanship and attention to detail.',
    projectCount: 15,
    establishedYear: 1976,
    slug: 'sobha-realty',
    status: 'active'
  },
  {
    id: '7',
    name: 'Select Group',
    logo: '/images/developers/select-group.png',
    description: 'Developer specializing in premium high-rise residential, commercial, and mixed-use developments.',
    projectCount: 12,
    establishedYear: 2002,
    slug: 'select-group',
    status: 'active'
  },
  {
    id: '8',
    name: 'Azizi Developments',
    logo: '/images/developers/azizi.png',
    description: 'Fast-growing developer with a diverse portfolio of residential and commercial properties.',
    projectCount: 24,
    establishedYear: 2007,
    slug: 'azizi-developments',
    status: 'active'
  }
];

// Helper function to fetch all developers
export const fetchAllDevelopers = async (): Promise<Developer[]> => {
  // In a real application, this would be an API call
  // For now, we'll simulate a delay to mimic an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(developers);
    }, 500);
  });
};

// Helper function to fetch a developer by slug
export const fetchDeveloperBySlug = async (slug: string): Promise<Developer | null> => {
  // In a real application, this would be an API call
  // For now, we'll simulate a delay to mimic an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const developer = developers.find(dev => dev.slug === slug) || null;
      resolve(developer);
    }, 300);
  });
};

// Helper function to fetch active developers
export const fetchActiveDevelopers = async (): Promise<Developer[]> => {
  // In a real application, this would be an API call
  // For now, we'll simulate a delay to mimic an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(developers.filter(dev => dev.status === 'active'));
    }, 500);
  });
}; 