'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { Playfair_Display } from 'next/font/google';
import { FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import Map from '../../../components/Map';
import { Property } from '../../../types/property';
import PhotoGallery from '@/components/PhotoGallery';
import PropertyCard from '@/components/properties/PropertyCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const playfair = Playfair_Display({ subsets: ['latin'] });

interface ClientPropertyPageProps {
  property: Property;
}

export default function ClientPropertyPage({ property }: ClientPropertyPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [language, setLanguage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);

  // Check if property is in favorites on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      setIsFavorite(favorites.includes(property.id));
    }
  }, [property.id]);

  const toggleFavorite = () => {
    const storedFavorites = localStorage.getItem('favorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    if (isFavorite) {
      favorites = favorites.filter((id: number | string) => id !== property.id);
    } else {
      favorites.push(property.id);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Could not copy text: ', error));
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
            src={property.images[currentImageIndex] || property.image || '/images/property-placeholder.jpg'} 
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
            {[
              { name: 'PDF Brochure', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { name: 'Floor Plans', icon: 'M9 4v16m0 0H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2h-4m-4 0v-8a2 2 0 012-2h4a2 2 0 012 2v8M9 4h4' },
              { name: 'Map View', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
              { name: 'Photo Gallery', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
              { name: 'Payment Plan', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
              { name: 'Video', icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z' }
            ].map((tab) => (
              <button
                key={tab.name}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.name.toLowerCase().replace(' ', '-')
                    ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab(tab.name.toLowerCase().replace(' ', '-'))}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                <span>{tab.name}</span>
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
              AED {property.price.toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Property Info Cards - Mobile Optimized */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Location</p>
            <p className="font-semibold text-gray-800">{property.location}</p>
          </div>
          <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">City</p>
            <p className="font-semibold text-gray-800">{property.city || 'Dubai'}</p>
          </div>
          <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Type</p>
            <p className="font-semibold text-gray-800">{property.type}</p>
          </div>
          <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Bedrooms</p>
            <p className="font-semibold text-gray-800">{property.beds}</p>
          </div>
        </div>

        {/* Navigation Tabs - Desktop Only */}
        <div className="hidden md:block sticky top-[72px] z-[40] bg-white/95 backdrop-blur-sm shadow-sm mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="overflow-x-auto py-4 no-scrollbar">
              <div className="flex justify-center">
                <div className="inline-flex space-x-4 bg-gray-100/80 backdrop-blur-sm py-4 px-4 rounded-xl shadow-lg">
                  {[
                    { name: 'PDF Brochure', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                    { name: 'Floor Plans', icon: 'M9 4v16m0 0H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2h-4m-4 0v-8a2 2 0 012-2h4a2 2 0 012 2v8M9 4h4' },
                    { name: 'Map View', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
                    { name: 'Photo Gallery', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
                    { name: 'Payment Plan', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
                    { name: 'Video', icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z' }
                  ].map((tab) => (
                    <button
                      key={tab.name}
                      className={`group flex flex-col items-center min-w-[100px] p-2 rounded-lg transition-all duration-200 ${
                        activeTab === tab.name.toLowerCase().replace(' ', '-')
                          ? 'bg-yellow-500 shadow-lg shadow-yellow-200/50 transform -translate-y-1'
                          : 'hover:bg-white hover:shadow-md'
                      }`}
                      onClick={() => setActiveTab(tab.name.toLowerCase().replace(' ', '-'))}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className={`w-6 h-6 mb-1 transition-colors ${
                          activeTab === tab.name.toLowerCase().replace(' ', '-')
                            ? 'text-white'
                            : 'text-gray-700 group-hover:text-yellow-600'
                        }`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                      </svg>
                      <span className={`text-sm font-medium transition-colors ${
                        activeTab === tab.name.toLowerCase().replace(' ', '-') 
                          ? 'text-white' 
                          : 'text-gray-700 group-hover:text-yellow-600'
                      }`}>{tab.name}</span>
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
              {(property.highlights || [
                `Prime Location: ${property.location}`,
                'Exclusive Residences: Limited collection of luxury units',
                'Smart Home Technology: Advanced automation for enhanced comfort',
                'Family-Friendly Amenities: Includes gym, playground, pool, and more',
                'Flexible Payment Plan: 5-year plan with post-handover installments'
              ]).map((highlight, index) => (
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
                <div className="p-4 md:p-6 font-semibold text-gray-800">During Construction: {property.paymentPlan?.construction || '65%'}</div>
                <div className="h-[2px] bg-yellow-500/50"></div>
                <div className="p-4 md:p-6 font-semibold text-gray-800">On Handover: {property.paymentPlan?.handover || '35%'}</div>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-sm">
                <div className="p-4 md:p-6 font-semibold text-gray-800">Handover: {property.paymentPlan?.handoverDate || '2026'}</div>
                <div className="h-[2px] bg-yellow-500/50"></div>
                <div className="p-4 md:p-6 font-semibold text-gray-800">Starting Price: AED {property.price.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 border-b pb-2">Photo Gallery</h2>
            <div className="relative">
              <PhotoGallery 
                images={property.images} 
                title={property.title || 'Property Gallery'} 
              />
            </div>
          </div>

          {/* Amenities Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 border-b pb-2">Amenities</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {(property.amenities || [
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
              ]).map((amenity, index) => (
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