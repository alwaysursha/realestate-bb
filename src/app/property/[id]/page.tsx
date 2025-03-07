import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPropertyById, featuredProperties } from '../../../data/properties';
import { Playfair_Display } from 'next/font/google';
import ClientPropertyPage from './client-page';

const playfair = Playfair_Display({ subsets: ['latin'] });

interface PropertyDetailPageProps {
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

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  return <ClientPropertyPage property={property} />;
} 