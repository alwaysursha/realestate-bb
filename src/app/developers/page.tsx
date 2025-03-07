'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Developer } from '@/data/developers';
import * as developersService from '@/services/developersService';

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadDevelopers = async () => {
      try {
        const data = await developersService.getActiveDevelopers();
        setDevelopers(data);
      } catch (error) {
        console.error('Error loading developers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDevelopers();
  }, []);

  const handleImageError = (developerId: string) => {
    setFailedImages((prev) => ({ ...prev, [developerId]: true }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center bg-blue-900">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/developers-hero.jpg"
            alt="Dubai Skyline"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white pt-8 pb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            UAE's Premier Developers
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore properties from the most prestigious and trusted real estate developers in the UAE
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Trusted Real Estate Developers</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((developer) => (
              <Link 
                key={developer.id} 
                href={`/developers/${developer.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="h-20 flex items-center justify-center mb-6">
                    {!failedImages[developer.id] ? (
                      <Image
                        src={developer.logo}
                        alt={developer.name}
                        width={160}
                        height={80}
                        className="object-contain max-h-16 transition-transform duration-300 group-hover:scale-105"
                        onError={() => handleImageError(developer.id)}
                        unoptimized={true}
                      />
                    ) : (
                      <h3 className="text-xl font-semibold text-center">{developer.name}</h3>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-center group-hover:text-blue-600 transition-colors">{developer.name}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">{developer.description}</p>
                  
                  <div className="flex justify-between text-sm text-gray-500 border-t pt-4 mt-auto">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">{developer.projectCount} Projects</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Est. {developer.establishedYear}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 