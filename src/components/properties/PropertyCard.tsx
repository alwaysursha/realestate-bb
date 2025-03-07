import { useState } from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { FaBed, FaBath, FaRuler, FaEnvelope } from 'react-icons/fa';
import InquiryModal from './InquiryModal';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const propertyImage = property.image || property.images[0] || '';

  const handleInquiryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInquiryModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <Link href={`/properties/${property.id}`} className="block relative">
          <div className="relative h-48">
            <img
              src={propertyImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                {property.category}
              </span>
            </div>
          </div>
        </Link>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/properties/${property.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-1">
                {property.title}
              </h3>
            </Link>
            <button
              onClick={handleInquiryClick}
              className="text-gray-500 hover:text-blue-600 transition-colors"
              title="Send Inquiry"
            >
              <FaEnvelope size={20} />
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-2">{property.location}</p>
          <p className="text-blue-600 font-semibold text-xl mb-4">
            ${property.price.toLocaleString()}
          </p>

          <div className="flex items-center justify-between text-gray-500 text-sm">
            <div className="flex items-center">
              <div className="mr-1">
                <FaBed size={16} />
              </div>
              <span>{property.beds} Beds</span>
            </div>
            <div className="flex items-center">
              <div className="mr-1">
                <FaBath size={16} />
              </div>
              <span>{property.baths} Baths</span>
            </div>
            <div className="flex items-center">
              <div className="mr-1">
                <FaRuler size={16} />
              </div>
              <span>{property.area} sqft</span>
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
