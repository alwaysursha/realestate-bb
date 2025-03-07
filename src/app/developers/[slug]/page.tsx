import { Developer, developers } from '@/data/developers';
import DeveloperDetails from '@/components/developers/DeveloperDetails';

export async function generateStaticParams() {
  return developers.map((developer: Developer) => ({
    slug: developer.slug,
  }));
}

// Additional developer details that would typically come from a more detailed API endpoint
interface DeveloperDetails extends Developer {
  fullDescription?: string;
  headquarters?: string;
  website?: string;
  ceo?: string;
}

// This would be replaced with a real API call in a production environment
const fetchDeveloperDetails = async (slug: string): Promise<DeveloperDetails | null> => {
  // First get the basic developer info from our shared data source
  const developer = developers.find(dev => dev.slug === slug);
  
  if (!developer) return null;
  
  // Add additional details based on the developer
  const additionalDetails: Record<string, Partial<DeveloperDetails>> = {
    'emaar-properties': {
      fullDescription: 'Emaar Properties is one of the world\'s most valuable and admired real estate development companies. With proven competencies in properties, shopping malls & retail and hospitality & leisure, Emaar shapes new lifestyles with a focus on design excellence, build quality and timely delivery.',
      headquarters: 'Dubai, UAE',
      website: 'https://www.emaar.com',
      ceo: 'Mohamed Alabbar'
    },
    // ... Add other developers' details here
  };
  
  // Return the developer with additional details if available
  return {
    ...developer,
    ...additionalDetails[developer.slug] || {}
  };
};

export default async function DeveloperPage({ params }: { params: { slug: string } }) {
  const developer = await fetchDeveloperDetails(params.slug);
  return <DeveloperDetails developer={developer} />;
} 