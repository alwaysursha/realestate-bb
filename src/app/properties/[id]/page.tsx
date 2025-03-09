import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPropertyById } from '@/services/propertiesService';
import { featuredProperties } from '@/data/properties';
import ClientPropertyPage from './client-page';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-static';
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour

// Generate static params for featured properties
export async function generateStaticParams() {
  return featuredProperties
    .filter(property => property.id !== undefined)
    .map((property) => ({
      id: property.id!.toString(),
    }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await getPropertyById(params.id);
  
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

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  return <ClientPropertyPage property={property} />;
} 