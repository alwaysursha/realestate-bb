import { useState, useRef } from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { FaBed, FaBath, FaRuler } from 'react-icons/fa';
import InquiryModal from './InquiryModal';
import ShareMenu from './ShareMenu';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number | string, e: React.MouseEvent) => void;
  onShare?: (property: Property, e: React.MouseEvent) => void;
}

export default function PropertyCard({ 
  property, 
  isFavorite = false, 
  onToggleFavorite,
  onShare,
}: PropertyCardProps) {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const propertyImage = property.image || property.images[0] || '';

  const handleInquiryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInquiryModalOpen(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite && property.id) {
      onToggleFavorite(property.id, e);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(property, e);
    } else {
      setIsShareMenuOpen(!isShareMenuOpen);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full w-full property-card">
        <Link href={`/property/${property.id}`} className="block relative">
          <div className="relative pb-[66.666667%]">
            <img
              src={propertyImage}
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md">
              {property.type}
            </span>
            {property.isFeatured && (
              <span className="absolute top-14 left-4 bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            )}
            <span className={`absolute top-4 right-4 text-white px-3 py-1 rounded-md ${
              property.status === 'Now Selling'
                ? 'bg-green-600' 
                : property.status === 'Coming Soon'
                  ? 'bg-yellow-500' 
                  : property.status === 'Sold Out'
                    ? 'bg-red-600'
                    : 'bg-green-600'
            }`}>
              {property.status}
            </span>
          </div>
        </Link>

        <div className="p-6 flex flex-col flex-grow">
          <Link href={`/property/${property.id}`} className="block">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-600 transition-colors">{property.title}</h3>
          </Link>
          <p className="text-gray-600 mb-4 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}, {property.city}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-blue-600">AED {property.price.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span>{property.beds} Beds</span>
            <span>•</span>
            <span>{property.baths} Baths</span>
            <span>•</span>
            <span>{property.area.toLocaleString()} sqft</span>
          </div>
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            <div className="text-xs text-gray-600">
              <span className="font-medium">Developer:</span> {property.developer}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleInquiryClick}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Email inquiry"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <div className="relative">
                <button 
                  ref={shareButtonRef}
                  onClick={handleShareClick}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="Share property"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <ShareMenu
                  property={property}
                  isOpen={isShareMenuOpen}
                  onClose={() => setIsShareMenuOpen(false)}
                />
              </div>
              {onToggleFavorite && (
                <button 
                  onClick={handleFavoriteClick}
                  className={`${isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        property={property}
      />
    </>
  );
}
