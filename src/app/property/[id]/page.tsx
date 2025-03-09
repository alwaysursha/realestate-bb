import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPropertyById } from '@/data/properties';
import { featuredProperties } from '@/data/properties';
import { Playfair_Display } from 'next/font/google';
import ClientPropertyPage from './client-page';

const playfair = Playfair_Display({ subsets: ['latin'] });

export const dynamic = 'force-static';
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour

interface PropertyPageProps {
  params: {
    id: string;
  };
}

// Generate static params for featured properties
export async function generateStaticParams() {
  return featuredProperties
    .filter(property => property.id !== undefined)
    .map((property) => ({
      id: property.id!.toString(),
    }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = getPropertyById(params.id);
  
  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.'
    };
  }
  
  return {
    title: property.title,
    description: property.description
  };
}

export default function PropertyDetailPage({ params }: PropertyPageProps) {
  const property = getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  return <ClientPropertyPage property={property} />;
} 