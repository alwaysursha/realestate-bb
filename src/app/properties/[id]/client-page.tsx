'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { Playfair_Display } from 'next/font/google';
import { Property } from '@/types/property';
import PhotoGallery from '@/components/PhotoGallery';
import PropertyCard from '@/components/properties/PropertyCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Map from '@/components/Map';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const playfair = Playfair_Display({ subsets: ['latin'] });

interface ClientPropertyPageProps {
  property: Property;
}

export default function ClientPropertyPage({ property }: ClientPropertyPageProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [language, setLanguage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Mock data for enhanced property details
  const mockData = {
    startingPrice: property.price,
    location: property.location,
    type: property.propertyType || property.type || 'Apartment',
    bedrooms: property.bedrooms || property.beds || ['Studio', '1', '2'],
    images: property.images || ['/images/property-temp.jpg'],
    highlights: [
      'Prime Location: ' + property.location,
      'Exclusive Residences: Limited collection of luxury units',
      'Smart Home Technology: Advanced automation for enhanced comfort',
      'Family-Friendly Amenities: Includes gym, playground, pool, and more',
      'Flexible Payment Plan: 5-year plan with post-handover installments'
    ],
    amenities: [
      'Private Pool',
      'Smart Home System',
      'Indoor and Outdoor Gyms',
      'Health Club (Spa, Sauna, and Steam Room)',
      'Community Pool',
      'Outdoor Movie Theater',
      'Kids Play Area',
      'BBQ Area',
      'Green Spaces',
      'Billiard Room'
    ],
    paymentPlan: {
      construction: '65%',
      handover: '35%',
      handoverDate: '2026',
      startingPrice: property.price
    }
  };
  
  // Mock similar properties data
  useEffect(() => {
    // Simulate fetching similar properties
    const mockSimilarProperties: Property[] = [
      {
        id: 1,
        title: "Luxury Apartment in Downtown Dubai",
        description: "Stunning luxury apartment in the heart of Downtown Dubai with panoramic views of Burj Khalifa",
        location: "Downtown Dubai",
        city: "Dubai",
        price: 2500000,
        type: "Apartment",
        status: "Now Selling",
        beds: 2,
        baths: 2,
        area: 1200,
        developer: "Emaar",
        image: "/images/property-temp.jpg",
        images: ["/images/property-temp.jpg"],
        isFeatured: true
      },
      // ... Add more mock properties as needed
    ];
    setSimilarProperties(mockSimilarProperties);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: {[key: string]: string} = {};
    if (!language) {
      errors.language = 'Please select your preferred language';
    }
    if (!name.trim()) {
      errors.name = 'Full Name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Form is valid, proceed with submission
    console.log('Form submitted with:', { name, email, language });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Cover Photo and Register Form */}
      <div className="relative h-[500px] md:h-[600px] w-full">
        {/* Cover Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={mockData.images[0]} 
            alt={property.title} 
            fill 
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text visibility on mobile */}
          <div className="absolute inset-0 bg-black/30 md:bg-black/20"></div>
        </div>
        
        {/* Register Form Overlay - Responsive */}
        <div className="absolute bottom-8 left-4 right-4 md:top-1/2 md:right-12 md:left-auto md:bottom-auto md:transform md:-translate-y-1/2 bg-white p-6 rounded-lg shadow-xl md:w-80 z-[30]">
          <h3 className="text-xl font-bold mb-4">Register Your Interest</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input 
                type="text" 
                placeholder="Full Name *" 
                className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (formErrors.name) {
                    setFormErrors({...formErrors, name: ''});
                  }
                }}
                required
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Email *" 
                className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) {
                    setFormErrors({...formErrors, email: ''});
                  }
                }}
                required
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div>
              <input 
                type="tel" 
                placeholder="Phone" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <select 
                value={language} 
                onChange={(e) => {
                  setLanguage(e.target.value);
                  if (formErrors.language) {
                    setFormErrors({...formErrors, language: ''});
                  }
                }}
                className={`w-full px-3 py-2 border ${formErrors.language ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                required
              >
                <option value="" disabled>Preferred Language</option>
                <option value="English">English</option>
                <option value="Arabic">Arabic</option>
                <option value="Russian">Russian</option>
                <option value="Chinese">Chinese</option>
                <option value="Hindi">Hindi</option>
                <option value="Urdu">Urdu</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Persian">Persian</option>
                <option value="Portuguese">Portuguese</option>
              </select>
              {formErrors.language && (
                <p className="mt-1 text-sm text-red-500">{formErrors.language}</p>
              )}
            </div>
            <button 
              type="submit" 
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      
      {/* Mobile Navigation Tabs */}
      <div className="md:hidden sticky top-[72px] z-[40] bg-gray-900/95 backdrop-blur-sm shadow-lg">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800">
          <div className="flex whitespace-nowrap py-4 px-4 gap-3 min-w-full">
            {['PDF Brochure', 'Floor Plans', 'Location Map', 'Photo Gallery', 'Payment Plan', 'Video'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.toLowerCase().replace(' ', '-')
                    ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {/* Scroll Indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900/95 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900/95 to-transparent pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Property Title and Price - Mobile Optimized */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-0 overflow-hidden">
            <h1 className="text-lg md:text-4xl font-bold truncate">{property.title}</h1>
            <span className={`whitespace-nowrap px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm font-medium rounded-full flex-shrink-0 ${
              property.status === 'Now Selling' 
                ? 'bg-green-100 text-green-800'
                : property.status === 'Coming Soon'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {property.status || 'Now Selling'}
            </span>
          </div>
          <div className="text-left md:text-right mb-6 md:mb-0">
            <p className="text-sm text-gray-500 mb-1">Starting Price</p>
            <p className="text-2xl md:text-3xl font-bold text-yellow-600">
              AED {mockData.startingPrice.toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Property Info Cards - Mobile Optimized */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Location</p>
            <p className="font-semibold text-gray-800">{mockData.location}</p>
          </div>
          <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">City</p>
            <p className="font-semibold text-gray-800">{property.city || 'Dubai'}</p>
          </div>
          <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Type</p>
            <p className="font-semibold text-gray-800">{mockData.type}</p>
          </div>
          <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Bedrooms</p>
            <p className="font-semibold text-gray-800">
              {Array.isArray(mockData.bedrooms) 
                ? mockData.bedrooms.join(', ') 
                : mockData.bedrooms}
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Desktop Only */}
        <div className="hidden md:block sticky top-[72px] z-[40] bg-white/95 backdrop-blur-sm shadow-sm mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="overflow-x-auto py-4 no-scrollbar">
              <div className="flex justify-center">
                <div className="inline-flex space-x-4 bg-gray-100/80 backdrop-blur-sm py-4 px-4 rounded-xl shadow-lg">
                  {['Brochure', 'Floor Plans', 'Map View', 'Gallery', 'Payment', 'Video'].map((tab) => (
                    <button
                      key={tab}
                      className={`group flex flex-col items-center min-w-[100px] p-2 rounded-lg transition-all duration-200 ${
                        activeTab === tab.toLowerCase().replace(' ', '-')
                          ? 'bg-yellow-500 shadow-lg shadow-yellow-200/50 transform -translate-y-1'
                          : 'hover:bg-white hover:shadow-md'
                      }`}
                      onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                    >
                      <span className={`text-sm font-medium transition-colors ${
                        activeTab === tab.toLowerCase().replace(' ', '-') 
                          ? 'text-white' 
                          : 'text-gray-700 group-hover:text-yellow-600'
                      }`}>{tab}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="py-6 md:py-8">
          {/* Highlights Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 border-b pb-2">Highlights</h2>
            <ul className="list-disc pl-5 space-y-2">
              {mockData.highlights.map((highlight, index) => (
                <li key={index} className="text-gray-700 text-sm md:text-base">{highlight}</li>
              ))}
            </ul>
          </div>

          {/* Project Details Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 border-b pb-2">Project Details</h2>
            <div className="space-y-4 text-sm md:text-base">
              <p className="text-gray-700">
                {property.description || `${property.title} is an elegant residential development located in the thriving community of ${property.location}. This premium project offers a limited collection of luxury units, with select units featuring designer balcony pools for an enhanced living experience.`}
              </p>
              <p className="text-gray-700">
                Residents will enjoy an array of premium family-friendly amenities, including indoor and outdoor gyms, a children's playground, a community pool, and more.
              </p>
            </div>
          </div>

          {/* Payment Plan Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 border-b pb-2">Payment Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm">
                <div className="p-4 md:p-6 font-semibold text-gray-800">During Construction: {mockData.paymentPlan.construction}</div>
                <div className="h-[2px] bg-yellow-500/50"></div>
                <div className="p-4 md:p-6 font-semibold text-gray-800">On Handover: {mockData.paymentPlan.handover}</div>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm">
                <div className="p-4 md:p-6 font-semibold text-gray-800">Handover: {mockData.paymentPlan.handoverDate}</div>
                <div className="h-[2px] bg-yellow-500/50"></div>
                <div className="p-4 md:p-6 font-semibold text-gray-800">Starting Price: AED {mockData.paymentPlan.startingPrice.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 border-b pb-2">Photo Gallery</h2>
            <div className="relative">
              <PhotoGallery 
                images={mockData.images} 
                title={property.title || 'Property Gallery'} 
              />
            </div>
          </div>

          {/* Amenities Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 border-b pb-2">Amenities</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {mockData.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center text-sm md:text-base">
                  <span className="mr-2 text-yellow-600">•</span>
                  <span className="text-gray-700">{amenity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 border-b pb-2">Location</h2>
            <div className="space-y-6">
              <p className="text-gray-700 text-sm md:text-base">
                {property.location} is an emerging residential community, strategically located within an expansive district. The community enjoys excellent connectivity, with major road networks ensuring swift access to key destinations.
              </p>
              
              <div>
                <h3 className="font-bold text-base md:text-lg mb-3">AREAS NEARBY:</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                  <li className="text-gray-700">Global Village – 5 Minutes</li>
                  <li className="text-gray-700">IMG Worlds of Adventure – 10 Minutes</li>
                  <li className="text-gray-700">Butterfly Garden – 10 Minutes</li>
                  <li className="text-gray-700">City Center – 15 Minutes</li>
                  <li className="text-gray-700">International Airport – 20 Minutes</li>
                </ul>
              </div>

              {/* Map Component */}
              {isMapLoaded && property.coordinates && (
                <div className="mt-6">
                  <Map 
                    center={property.coordinates}
                    zoom={15}
                    markers={[{
                      position: property.coordinates,
                      title: property.title
                    }]}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Downloads Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 border-b pb-2">Downloads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="border border-gray-200 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-4">Download Brochure</h3>
                <button 
                  type="button" 
                  className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Brochure</span>
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-4">Download Floorplan</h3>
                <button 
                  type="button" 
                  className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Floorplan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Similar Properties - Enhanced with Swiper */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">You May Also Like</h2>
            <div className="relative">
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="similar-properties-swiper !pb-12"
              >
                {similarProperties.map((prop) => (
                  <SwiperSlide key={prop.id}>
                    <PropertyCard property={prop} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-gray-100 py-8 md:py-12 mt-8 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Be the first to know about new project launches</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Stay updated with the latest property launches, exclusive offers, and market insights.</p>
            <form className="max-w-xl mx-auto flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Full Name *" 
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
                  required
                />
                <input 
                  type="email" 
                  placeholder="Email Address *" 
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full sm:w-auto sm:mx-auto px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-base font-medium shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
              >
                <span>Subscribe Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 