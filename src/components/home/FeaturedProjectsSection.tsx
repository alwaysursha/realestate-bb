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
              overflow: hidden;
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
                <Link href={`/property/${property.id}`} className="block h-full w-full">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full property-card">
                    <div className="relative pb-[66.666667%]">
                      <img
                        src={property.image}
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
                            : 'bg-red-600'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">{property.title}</h3>
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
                      <div className="flex items-center gap-4 text-gray-500">
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
                            onClick={(e) => handleEmailInquiry(property, e)}
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            aria-label="Email inquiry"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => handleShare(property, e)}
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            aria-label="Share property"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => toggleFavorite(property.id, e)}
                            className={`${favorites.includes(property.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                            aria-label="Save to favorites"
                          >
                            <svg className="w-4 h-4" fill={favorites.includes(property.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
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