'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import PhotoGallery from '@/components/PhotoGallery';
import PropertyCard from '@/components/properties/PropertyCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PreviewClientPageProps {
  property: Property;
}

export default function PreviewClientPage({ property }: PreviewClientPageProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [language, setLanguage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  
  // Mock data for the property (similar to Lazord)
  const mockData = {
    startingPrice: property.price,
    location: property.location,
    type: property.propertyType || property.type || 'Apartment',
    bedrooms: property.bedrooms || property.beds || ['Studio', '1', '2'],
    images: [
      '/images/1-1.jpg',
      '/images/1-2.jpg',
      '/images/1-3.jpg',
      '/images/1-4.jpg',
      '/images/1-5.jpg'
    ],
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
  
  // Mock similar properties data (replace with real API call)
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
      {
        id: 2,
        title: "Premium Villa in Palm Jumeirah",
        description: "Exclusive beachfront villa on Palm Jumeirah with private pool and direct beach access",
        location: "Palm Jumeirah",
        city: "Dubai",
        price: 5500000,
        type: "Villa",
        status: "Now Selling",
        beds: 4,
        baths: 5,
        area: 3500,
        developer: "Nakheel",
        image: "/images/property-temp.jpg",
        images: ["/images/property-temp.jpg"],
        isFeatured: true
      },
      {
        id: 3,
        title: "Modern Townhouse in Dubai Hills",
        description: "Contemporary townhouse in Dubai Hills Estate with premium finishes and park views",
        location: "Dubai Hills",
        city: "Dubai",
        price: 3200000,
        type: "Townhouse",
        status: "Coming Soon",
        beds: 3,
        baths: 3.5,
        area: 2100,
        developer: "Emaar",
        image: "/images/property-temp.jpg",
        images: ["/images/property-temp.jpg"],
        isFeatured: false
      },
      {
        id: 4,
        title: "Waterfront Apartment in Dubai Marina",
        description: "Elegant waterfront apartment in Dubai Marina with stunning marina and sea views",
        location: "Dubai Marina",
        city: "Dubai",
        price: 1800000,
        type: "Apartment",
        status: "Now Selling",
        beds: 1,
        baths: 2,
        area: 950,
        developer: "Select Group",
        image: "/images/property-temp.jpg",
        images: ["/images/property-temp.jpg"],
        isFeatured: false
      }
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
    // Reset errors
    setFormErrors({});
    // Here you would typically submit the form data to your backend
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Cover Photo and Register Form */}
      <div className="relative h-[500px] md:h-[600px] w-full">
        {/* Cover Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/property-temp.jpg" 
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
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      
      {/* Mobile Navigation Tabs - Positioned below hero section */}
      <div className="md:hidden sticky top-[72px] z-[999] bg-gray-900/95 backdrop-blur-sm shadow-lg">
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
            <p className="font-semibold text-gray-800">Dubai</p>
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
      </div>

      {/* Navigation Tabs - Desktop Only */}
      <div className="hidden md:block sticky top-[72px] z-[40] bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto py-4 no-scrollbar">
            <div className="flex justify-center">
              <div className="inline-flex space-x-4 bg-gray-100/80 backdrop-blur-sm py-4 px-4 rounded-xl shadow-lg">
                <button
                  className={`group flex flex-col items-center min-w-[100px] p-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'pdf-brochure'
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-200/50 transform -translate-y-1'
                      : 'hover:bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveTab('pdf-brochure')}
                >
                  <div className={`p-2 rounded-full mb-1 transition-colors ${
                    activeTab === 'pdf-brochure' 
                      ? 'bg-white/20' 
                      : 'bg-yellow-50 group-hover:bg-yellow-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${
                      activeTab === 'pdf-brochure' ? 'text-white' : 'text-yellow-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    activeTab === 'pdf-brochure' ? 'text-white' : 'text-gray-700 group-hover:text-yellow-600'
                  }`}>Brochure</span>
                </button>

                <button
                  className={`group flex flex-col items-center min-w-[100px] p-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'floor-plans'
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-200/50 transform -translate-y-1'
                      : 'hover:bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveTab('floor-plans')}
                >
                  <div className={`p-2 rounded-full mb-1 transition-colors ${
                    activeTab === 'floor-plans' 
                      ? 'bg-white/20' 
                      : 'bg-yellow-50 group-hover:bg-yellow-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${
                      activeTab === 'floor-plans' ? 'text-white' : 'text-yellow-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    activeTab === 'floor-plans' ? 'text-white' : 'text-gray-700 group-hover:text-yellow-600'
                  }`}>Floor Plans</span>
                </button>

                <button
                  className={`group flex flex-col items-center min-w-[100px] p-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'location-map'
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-200/50 transform -translate-y-1'
                      : 'hover:bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveTab('location-map')}
                >
                  <div className={`p-2 rounded-full mb-1 transition-colors ${
                    activeTab === 'location-map' 
                      ? 'bg-white/20' 
                      : 'bg-yellow-50 group-hover:bg-yellow-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${
                      activeTab === 'location-map' ? 'text-white' : 'text-yellow-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    activeTab === 'location-map' ? 'text-white' : 'text-gray-700 group-hover:text-yellow-600'
                  }`}>Map View</span>
                </button>

                <button
                  className={`group flex flex-col items-center min-w-[100px] p-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'photo-gallery'
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-200/50 transform -translate-y-1'
                      : 'hover:bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveTab('photo-gallery')}
                >
                  <div className={`p-2 rounded-full mb-1 transition-colors ${
                    activeTab === 'photo-gallery' 
                      ? 'bg-white/20' 
                      : 'bg-yellow-50 group-hover:bg-yellow-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${
                      activeTab === 'photo-gallery' ? 'text-white' : 'text-yellow-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    activeTab === 'photo-gallery' ? 'text-white' : 'text-gray-700 group-hover:text-yellow-600'
                  }`}>Photo Gallery</span>
                </button>

                <button
                  className={`group flex flex-col items-center min-w-[100px] p-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'payment-plan'
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-200/50 transform -translate-y-1'
                      : 'hover:bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveTab('payment-plan')}
                >
                  <div className={`p-2 rounded-full mb-1 transition-colors ${
                    activeTab === 'payment-plan' 
                      ? 'bg-white/20' 
                      : 'bg-yellow-50 group-hover:bg-yellow-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${
                      activeTab === 'payment-plan' ? 'text-white' : 'text-yellow-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    activeTab === 'payment-plan' ? 'text-white' : 'text-gray-700 group-hover:text-yellow-600'
                  }`}>Payment Plan</span>
                </button>

                <button
                  className={`group flex flex-col items-center min-w-[100px] p-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'video'
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-200/50 transform -translate-y-1'
                      : 'hover:bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveTab('video')}
                >
                  <div className={`p-2 rounded-full mb-1 transition-colors ${
                    activeTab === 'video' 
                      ? 'bg-white/20' 
                      : 'bg-yellow-50 group-hover:bg-yellow-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${
                      activeTab === 'video' ? 'text-white' : 'text-yellow-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    activeTab === 'video' ? 'text-white' : 'text-gray-700 group-hover:text-yellow-600'
                  }`}>Video</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
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

        {/* Enquiry Form - Mobile Optimized */}
        <div className="mb-8 md:mb-12 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-6 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Enquire About {property.title}</h2>
            <p className="text-gray-300 mb-6 md:mb-8 text-sm md:text-base">Fill out the form below and our team will get back to you shortly</p>
            
            <form className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">Full Name *</label>
                  <input 
                    id="fullName"
                    type="text" 
                    placeholder="Enter your full name" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email Address *</label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-200">Message</label>
                <textarea 
                  id="message"
                  rows={4}
                  placeholder="Your message here..." 
                  className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-400"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm md:text-base"
              >
                Send Enquiry
              </button>
            </form>
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
      
      {/* Newsletter Section - Mobile Optimized */}
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