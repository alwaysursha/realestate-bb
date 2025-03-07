'use client'

import Image from 'next/image'
import Link from 'next/link'
import HeroSection from '@/components/home/HeroSection'
import DevelopersSection from '@/components/developers/DevelopersSection'
import FeaturedProjectsSection from '@/components/home/FeaturedProjectsSection'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useState } from 'react'
import { featuredProperties, getPropertiesByCategory } from '../data/properties'
import { Property } from '../types/property'
import InquiryModal from '@/components/properties/InquiryModal'

export default function Home() {
  const [favorites, setFavorites] = useState<(number|string)[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  
  // Get properties by category
  const apartmentProperties = getPropertiesByCategory('apartment');
  const villaProperties = getPropertiesByCategory('villa');

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
    <main>
      <HeroSection />

      {/* Featured Projects Section */}
      <FeaturedProjectsSection />

      {/* Apartments Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Apartments <span className="text-yellow-500">•</span> Penthouses</h2>
                <p className="text-gray-600 max-w-2xl">Explore our collection of premium apartments in prime locations</p>
              </div>
              <Link href="/properties/apartments-penthouses" className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                View All Apartments
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
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
            {apartmentProperties.map((property) => (
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
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{property.location}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-blue-600">AED {property.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>{property.beds} Beds</span>
                          <span>•</span>
                          <span>{property.baths} Baths</span>
                          <span>•</span>
                          <span>{property.area.toLocaleString()} sqft</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100 mt-4">
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
            {/* Mobile View All Button */}
            <div className="mt-8 md:hidden text-center">
              <Link href="/properties/apartments-penthouses" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                View All Apartments
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Houses Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Villas <span className="text-yellow-500">•</span> Townhouses</h2>
                <p className="text-gray-600 max-w-2xl">Discover our exclusive collection of luxury villas and townhouses</p>
            </div>
              <Link href="/properties/villas-townhouses" className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                View All Villas
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full">
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
            {villaProperties.map((property) => (
                <SwiperSlide key={property.id} className="h-auto">
                  <Link href={`/property/${property.id}`} className="block h-full w-full">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full property-card border border-gray-200">
                      <div className="relative pb-[66.666667%]">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md">
                          {property.type}
                        </span>
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
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{property.location}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-blue-600">AED {property.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>{property.beds} Beds</span>
                          <span>•</span>
                          <span>{property.baths} Baths</span>
                          <span>•</span>
                          <span>{property.area.toLocaleString()} sqft</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100 mt-4">
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
            {/* Mobile View All Button */}
            <div className="mt-8 md:hidden text-center">
              <Link href="/properties/villas-townhouses" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                View All Villas
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Explore Cities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover properties across the UAE's most vibrant cities</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Dubai */}
            <div className="relative aspect-square group overflow-hidden rounded-lg">
              <img
                src="/images/cities/dubai.jpg"
                alt="Dubai"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-extrabold text-white text-center tracking-wider uppercase transform group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Dubai</h3>
              </div>
            </div>

            {/* Abu Dhabi */}
            <div className="relative aspect-square group overflow-hidden rounded-lg">
              <img
                src="/images/cities/abu-dhabi.jpg"
                alt="Abu Dhabi"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-extrabold text-white text-center tracking-wider uppercase transform group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Abu Dhabi</h3>
              </div>
            </div>

            {/* Sharjah */}
            <div className="relative aspect-square group overflow-hidden rounded-lg">
              <img
                src="/images/cities/sharjah.jpg"
                alt="Sharjah"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-extrabold text-white text-center tracking-wider uppercase transform group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Sharjah</h3>
              </div>
            </div>

            {/* Ajman */}
            <div className="relative aspect-square group overflow-hidden rounded-lg">
              <img
                src="/images/cities/ajman.jpg"
                alt="Ajman"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-extrabold text-white text-center tracking-wider uppercase transform group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Ajman</h3>
              </div>
            </div>

            {/* Ras Al-Khaimah */}
            <div className="relative aspect-square group overflow-hidden rounded-lg">
              <img
                src="/images/cities/ras-al-khaimah.jpg"
                alt="Ras Al-Khaimah"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-extrabold text-white text-center tracking-wider uppercase transform group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Ras Al-Khaimah</h3>
              </div>
            </div>

            {/* Umm Al-Quwain */}
            <div className="relative aspect-square group overflow-hidden rounded-lg">
              <img
                src="/images/cities/umm-al-quwain.jpg"
                alt="Umm Al-Quwain"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-extrabold text-white text-center tracking-wider uppercase transform group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Umm Al-Quwain</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <DevelopersSection />

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience the difference with our comprehensive real estate services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Expert Guidance */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Our experienced team provides personalized advice to help you make informed decisions.</p>
            </div>

            {/* Wide Selection */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Access to an extensive portfolio of properties across prime locations in the UAE.</p>
            </div>

            {/* Transparent Process */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparent Process</h3>
              <p className="text-gray-600">Clear communication and honest dealings throughout your property journey.</p>
            </div>

            {/* After-Sales Support */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">After-Sales Support</h3>
              <p className="text-gray-600">Comprehensive support services to ensure a smooth transition into your new property.</p>
            </div>
          </div>
        </div>
      </section>

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
    </main>
  )
}
