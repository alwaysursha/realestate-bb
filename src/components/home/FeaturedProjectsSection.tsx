'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Property } from '@/types/property'
import { featuredProperties } from '@/data/properties'
import InquiryModal from '@/components/properties/InquiryModal'
import PropertyCard from '@/components/properties/PropertyCard'

export default function FeaturedProjectsSection() {
  const [favorites, setFavorites] = useState<(number|string)[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  useEffect(() => {
    // Temporarily use static data until API is set up
    const featured = featuredProperties.filter(property => property.isFeatured);
    setProperties(featured);
    setFilteredProperties(featured);
  }, []);

  const toggleFavorite = (id: number | string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const handleEmailInquiry = (property: Property, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProperty(property);
    setIsInquiryModalOpen(true);
  };

  const handleShare = (property: Property, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this ${property.type} in ${property.location}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Share feature is not supported in your browser. You can copy the URL and share it manually.');
    }
  };

  return (
    <section className="py-12 md:py-20 bg-gray-50" id="featured-projects">
      <div className="container mx-auto px-2 md:px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="relative flex items-center justify-center mb-2">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Projects</h2>
            <Link href="/properties/featured-projects">
              <button className="hidden md:flex absolute right-0 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all duration-300 text-sm font-medium items-center gap-2">
                View All Featured
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </button>
            </Link>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">Discover our selection of premium properties</p>
        </div>
        
        <div className="relative mx-auto w-full">
          <style jsx global>{`
            .swiper-button-next,
            .swiper-button-prev {
              top: 40% !important;
              transform: translateY(-50%);
              width: 40px !important;
              height: 40px !important;
              background: white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
              color: #2563eb !important;
              z-index: 20;
            }
            .swiper-button-next:after,
            .swiper-button-prev:after {
              font-size: 18px !important;
            }
            .swiper-button-next {
              right: 10px !important;
            }
            .swiper-button-prev {
              left: 10px !important;
            }
            .swiper-wrapper {
              touch-action: pan-x pan-y;
              will-change: transform;
              display: flex;
              align-items: stretch;
              padding: 20px 0;
              margin: -20px 0;
            }
            .swiper-slide {
              height: auto !important;
              width: 100% !important;
              flex-shrink: 0;
              touch-action: pan-x pan-y;
              display: flex;
            }
            @media (min-width: 640px) {
              .swiper-slide {
                width: calc((100% - 20px) / 2) !important;
              }
            }
            @media (min-width: 1024px) {
              .swiper-slide {
                width: calc((100% - 48px) / 3) !important;
              }
            }
            .swiper {
              overflow: visible;
              cursor: grab;
              position: relative;
              z-index: 1;
              width: 100%;
              max-width: 1280px;
              margin-left: auto;
              margin-right: auto;
              padding: 0 !important;
            }
            .swiper:active {
              cursor: grabbing;
            }
            .property-card {
              width: 100%;
              display: flex;
              flex-direction: column;
              min-height: 420px;
              overflow: visible !important;
              height: 100%;
              position: relative;
            }
            @media (max-width: 640px) {
              .property-card {
                min-height: 400px;
              }
              .property-card h3 {
                font-size: 1rem;
                margin-bottom: 0.375rem;
              }
              .property-card p {
                font-size: 0.75rem;
                margin-bottom: 0.75rem;
              }
              .property-card .text-2xl {
                font-size: 1.125rem;
              }
              .property-card .flex.items-center.gap-4 {
                gap: 0.5rem;
                font-size: 0.7rem;
              }
              .property-card .p-6 {
                padding: 0.75rem;
              }
              .property-card .pt-4 {
                padding-top: 0.5rem;
              }
              .property-card .mt-4 {
                margin-top: 0.5rem;
              }
              .property-card .mb-4 {
                margin-bottom: 0.5rem;
              }
              .property-card .text-xs {
                font-size: 0.65rem;
              }
            }
          `}</style>
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation
            speed={200}
            threshold={10}
            touchRatio={1.5}
            simulateTouch={true}
            followFinger={true}
            touchStartPreventDefault={false}
            passiveListeners={true}
            grabCursor={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
                speed: 300,
              },
            }}
            className="!px-0 w-full"
          >
            {filteredProperties.map((property) => (
              <SwiperSlide key={property.id} className="h-auto">
                <PropertyCard
                  property={property}
                  isFavorite={property.id ? favorites.includes(property.id) : false}
                  onToggleFavorite={toggleFavorite}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Mobile View All Button - restored to original position */}
          <div className="md:hidden mt-8 text-center">
            <Link href="/properties/featured-projects">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all duration-300 text-sm font-medium flex items-center gap-2 mx-auto">
                View All Featured
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {selectedProperty && (
        <InquiryModal
          isOpen={isInquiryModalOpen}
          onClose={() => {
            setIsInquiryModalOpen(false);
            setSelectedProperty(null);
          }}
          property={selectedProperty}
        />
      )}
    </section>
  )
} 