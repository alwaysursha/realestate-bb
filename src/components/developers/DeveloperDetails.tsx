'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Developer } from '@/data/developers';

interface DeveloperDetailsProps {
  developer: (Developer & {
    fullDescription?: string;
    headquarters?: string;
    website?: string;
    ceo?: string;
  }) | null;
}

export default function DeveloperDetails({ developer }: DeveloperDetailsProps) {
  const [imageError, setImageError] = useState(false);

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