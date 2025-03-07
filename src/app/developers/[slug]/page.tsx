'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Developer, fetchDeveloperBySlug } from '@/data/developers';

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
  const developer = await fetchDeveloperBySlug(slug);
  
  if (!developer) return null;
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Add additional details based on the developer
  const additionalDetails: Record<string, Partial<DeveloperDetails>> = {
    'emaar-properties': {
      fullDescription: 'Emaar Properties is one of the world\'s most valuable and admired real estate development companies. With proven competencies in properties, shopping malls & retail and hospitality & leisure, Emaar shapes new lifestyles with a focus on design excellence, build quality and timely delivery. Emaar is behind iconic projects such as Burj Khalifa, The Dubai Mall, Dubai Creek Harbour, and many more landmark developments that have transformed the urban landscape.',
      headquarters: 'Dubai, UAE',
      website: 'https://www.emaar.com',
      ceo: 'Mohamed Alabbar'
    },
    'nakheel': {
      fullDescription: 'Nakheel is a world-leading master developer whose innovative, landmark projects form an iconic portfolio of master communities and residential, retail, hospitality and leisure developments that are pivotal to realizing Dubai\'s vision. Nakheel\'s waterfront projects, including the world-famous, award-winning Palm Jumeirah, have added more than 300 kilometers to Dubai\'s original, 70km coastline, paving the way for the development of hundreds of seafront homes, resorts, hotels and attractions.',
      headquarters: 'Dubai, UAE',
      website: 'https://www.nakheel.com',
      ceo: 'Naaman Atallah'
    },
    'dubai-properties': {
      fullDescription: 'Dubai Properties is a leading Dubai-based real estate master developer known for its destination developments across the emirate. The company\'s diverse real estate portfolio includes residential developments, commercial projects, and mixed-use destinations. Dubai Properties has delivered iconic projects such as Jumeirah Beach Residence (JBR), Business Bay, and Culture Village, which have significantly contributed to Dubai\'s urban landscape and real estate market.',
      headquarters: 'Dubai, UAE',
      website: 'https://www.dp.ae',
      ceo: 'Raed Al Nuaimi'
    },
    'damac-properties': {
      fullDescription: 'DAMAC Properties has been at the forefront of the Middle East\'s luxury real estate market since 2002, delivering award-winning residential, commercial and leisure properties across the region, including the UAE, Saudi Arabia, Qatar, Jordan, Lebanon, and the United Kingdom. DAMAC has collaborated with some of the most recognizable names in fashion and lifestyle, including Versace, Fendi, Just Cavalli, and Bugatti, to bring truly unique living experiences to the market.',
      headquarters: 'Dubai, UAE',
      website: 'https://www.damacproperties.com',
      ceo: 'Hussain Sajwani'
    },
    'meraas': {
      fullDescription: 'Meraas is dedicated to making Dubai and the UAE better for people to live, work and play in. We design for a diverse mix of people to create a more engaging physical, cultural and social landscape that enriches the lives of residents and visitors alike. Meraas has developed and operates a portfolio of destinations that includes City Walk, The Beach, Boxpark, Last Exit, The Outlet Village, Al Seef, La Mer, Bluewaters, and more.',
      headquarters: 'Dubai, UAE',
      website: 'https://www.meraas.com',
      ceo: 'Abdulla Al Habbai'
    },
    'sobha-realty': {
      fullDescription: 'Sobha Realty is an international luxury developer committed to redefining the art of living through sustainable communities. Established in 1976 by PNC Menon, a visionary entrepreneur, the company has grown from a small interior decoration firm in Oman to a multinational, multifaceted real estate development company with projects across the Middle East and India. Sobha Hartland, the company\'s flagship project in Dubai, is a mixed-use development located in the heart of the city.',
      headquarters: 'Dubai, UAE',
      website: 'https://www.sobharealty.com',
      ceo: 'Ravi Menon'
    },
    'select-group': {
      fullDescription: 'Select Group is one of the region\'s largest privately-owned real estate development and investment companies specializing in high-rise residential, commercial, and mixed-use developments. With a proven track record of delivering award-winning developments, the group has established itself as a leading real estate developer in the UAE. Select Group\'s portfolio includes luxury waterfront developments in Dubai Marina and other prime locations across Dubai.',
      headquarters: 'Dubai, UAE',
      website: 'https://select-group.ae',
      ceo: 'Rahail Aslam'
    },
    'azizi-developments': {
      fullDescription: 'Azizi Developments is one of the leading private developers in the UAE. With thousands of homes successfully delivered to satisfied residents and investors, the developer prides itself on its extensive portfolio of modern luxury developments across Dubai\'s most sought-after residential and commercial destinations. Azizi Developments is known for its commitment to creating urban neighborhoods supported by investments in the development of high-quality homes.',
      headquarters: 'Dubai, UAE',
      website: 'https://www.azizidevelopments.com',
      ceo: 'Mirwais Azizi'
    }
  };
  
  // Return the developer with additional details if available
  return {
    ...developer,
    ...additionalDetails[developer.slug] || {}
  };
};

export default function DeveloperDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [developer, setDeveloper] = useState<DeveloperDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadDeveloper = async () => {
      try {
        const data = await fetchDeveloperDetails(slug);
        setDeveloper(data);
      } catch (error) {
        console.error('Failed to fetch developer:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeveloper();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Developer Not Found</h1>
          <p className="text-gray-600 mb-8">The developer you're looking for doesn't exist or has been removed.</p>
          <Link href="/developers" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300">
            <span>Back to Developers</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center bg-blue-900">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/images/hero-2.jpg" 
            alt={developer.name} 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-8 pb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{developer.name}</h1>
          <p className="text-lg md:text-xl">{developer.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/developers" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Developers
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="w-full md:w-48 h-32 relative bg-white rounded-md border border-gray-200 p-4 flex items-center justify-center">
                {imageError ? (
                  <span className="text-xl font-semibold text-gray-600">{developer.name}</span>
                ) : (
                  <Image
                    src={developer.logo}
                    alt={`${developer.name} logo`}
                    fill
                    className="object-contain p-2"
                    onError={() => setImageError(true)}
                    unoptimized={true}
                  />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Company Overview</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {developer.projectCount} Projects
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Established {developer.establishedYear}
                  </div>
                  {developer.headquarters && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {developer.headquarters}
                    </div>
                  )}
                </div>
                {developer.website && (
                  <a 
                    href={developer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300"
                  >
                    <span className="mr-2">Visit Website</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {developer.name}</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-6">{developer.fullDescription || developer.description}</p>
              </div>
            </div>

            {developer.ceo && (
              <div className="border-t border-gray-200 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Leadership</h2>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{developer.ceo}</h3>
                    <p className="text-gray-600">Chief Executive Officer</p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Properties</h2>
              <div className="text-center py-12 bg-gray-100 rounded-lg">
                <p className="text-gray-600">Properties from this developer will be displayed here.</p>
                <p className="text-sm text-gray-500 mt-2">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 