import React from 'react';
import { notFound } from 'next/navigation';
import { getPropertyById, featuredProperties } from '../../../data/properties';
import ClientPropertyPage from './client-page';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

// This function generates all possible property IDs at build time
export async function generateStaticParams() {
  return featuredProperties.map((property) => ({
    id: property.id.toString(),
  }));
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const property = getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  return <ClientPropertyPage property={property} />;
} 