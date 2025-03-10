export interface Property {
  id?: string | number;
  title: string;
  description: string;
  price: number;
  location: string;
  city?: string;
  address?: string;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  baths?: number;
  area: number;
  propertyType?: string;
  type?: string;
  status: string;
  features?: string[];
  amenities?: string[];
  highlights?: string[];
  images: string[];
  image?: string;
  developerId?: string;
  developerName?: string;
  developer?: string;
  agentId?: string;
  agentName?: string;
  agent?: {
    name: string;
    role: string;
    phone: string;
    email: string;
    image: string;
  };
  paymentPlan?: {
    construction: string;
    handover: string;
    handoverDate: string;
    startingPrice: number;
  };
  createdAt?: any;
  updatedAt?: any;
  lastViewed?: Date;
  featured?: boolean;
  isFeatured?: boolean;
  slug?: string;
  category?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  yearBuilt?: number;
  viewCount?: number;
} 