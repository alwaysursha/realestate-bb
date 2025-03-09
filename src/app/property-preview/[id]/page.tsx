import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPropertyById } from '@/data/properties';
import { featuredProperties } from '@/data/properties';
import PreviewClientPage from './preview-client-page';

export const dynamic = 'force-static';
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour

interface PropertyPreviewPageProps {
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

export async function generateMetadata({ params }: PropertyPreviewPageProps): Promise<Metadata> {
  const property = getPropertyById(params.id);
  
  if (!property) {
    return {
      title: 'Property Preview Not Found',
      description: 'The requested property preview could not be found.'
    };
  }
  
  return {
    title: `Preview: ${property.title}`,
    description: property.description
  };
}

export default function PropertyPreviewPage({ params }: PropertyPreviewPageProps) {
  const property = getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  return <PreviewClientPage property={property} />;
} 