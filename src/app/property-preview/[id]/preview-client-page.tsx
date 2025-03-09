'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';

interface PreviewClientPageProps {
  property: Property;
}

export default function PreviewClientPage({ property }: PreviewClientPageProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [language, setLanguage] = useState('English');
  
  // Mock data for the property (similar to Lazord)
  const mockData = {
    startingPrice: property.price,
    location: property.location,
    type: property.propertyType || property.type || 'Apartment',
    bedrooms: property.bedrooms || property.beds || ['Studio', '1', '2'],
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
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Cover Photo and Register Form */}
      <div className="relative h-[600px] w-full">
        {/* Cover Image */}
        <div className="absolute inset-0 z-0">
          {/* Using the property-temp.jpg image instead of property images */}
          <Image 
            src="/images/property-temp.jpg" 
            alt={property.title} 
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        {/* Register Form Overlay */}
        <div className="absolute top-1/2 right-12 transform -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-80 z-10">
          <h3 className="text-xl font-bold mb-4">Register Your Interest</h3>
          <form className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
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
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="English">English</option>
                <option value="Arabic">Arabic</option>
                <option value="Russian">Russian</option>
                <option value="Chinese">Chinese</option>
                <option value="Hindi">Hindi</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>
            <button 
              type="button" 
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      
      {/* Property Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold">{property.title}</h1>
          <Link 
            href={`/property/${property.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            View Current Design
          </Link>
        </div>
        
        {/* Property Info Table */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-gray-200 py-4">
          <div>
            <p className="text-gray-500">Starting Price</p>
            <p className="font-semibold">AED {mockData.startingPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-semibold">{mockData.location}</p>
          </div>
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-semibold">{mockData.type}</p>
          </div>
          <div>
            <p className="text-gray-500">Bedrooms</p>
            <p className="font-semibold">
              {Array.isArray(mockData.bedrooms) 
                ? mockData.bedrooms.join(', ') 
                : mockData.bedrooms}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-1 py-2">
            {['PDF Brochure', 'Floor Plans', 'Location Map', 'Photo Gallery', 'Payment Plan', 'Video'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium whitespace-nowrap ${
                  activeTab === tab.toLowerCase().replace(' ', '-')
                    ? 'bg-white text-blue-600 rounded-t-md border-t border-l border-r border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Highlights Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Highlights</h2>
          <ul className="list-disc pl-5 space-y-2">
            {mockData.highlights.map((highlight, index) => (
              <li key={index} className="text-gray-700">{highlight}</li>
            ))}
          </ul>
        </div>
        
        {/* Project Details Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Project Details</h2>
          <p className="text-gray-700 mb-4">
            {property.description || `${property.title} is an elegant residential development located in the thriving community of ${property.location}. This premium project offers a limited collection of luxury units, with select units featuring designer balcony pools for an enhanced living experience. Designed for modern urban lifestyles, the development combines sophisticated architecture with high-end finishes and a carefully curated selection of amenities that cater to both relaxation and entertainment.`}
          </p>
          <p className="text-gray-700">
            Residents will enjoy an array of premium family-friendly amenities, including indoor and outdoor gyms, a children's playground, a community pool, an outdoor movie theater, and a fully equipped health club with a spa, sauna, and steam room. The development also features BBQ areas, beautifully landscaped gardens, and dedicated concierge and valet services to enhance convenience.
          </p>
        </div>
        
        {/* Payment Plan Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Payment Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 font-semibold">During Construction: {mockData.paymentPlan.construction}</div>
              <div className="p-4"></div>
              <div className="bg-gray-50 p-4 font-semibold">On Handover: {mockData.paymentPlan.handover}</div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 font-semibold">Handover: {mockData.paymentPlan.handoverDate}</div>
              <div className="p-4"></div>
              <div className="bg-gray-50 p-4 font-semibold">Starting Price: AED {mockData.paymentPlan.startingPrice.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        {/* Photo Gallery Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {property.images && property.images.length > 0 ? (
              property.images.map((image, index) => (
                <div key={index} className="aspect-w-4 aspect-h-3 relative h-48 rounded-lg overflow-hidden">
                  <Image 
                    src={image} 
                    alt={`${property.title} - Image ${index + 1}`} 
                    fill 
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              Array(8).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Gallery Image {index + 1}</p>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Amenities Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Amenities</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockData.amenities.map((amenity, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-2 text-blue-600">•</span>
                <span className="text-gray-700">{amenity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Location Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Location</h2>
          <p className="text-gray-700 mb-6">
            {property.location} is an emerging residential community, strategically located within an expansive district. Designed as a well-integrated mixed-use neighborhood, it offers a collection of residential buildings featuring various unit types. The community enjoys excellent connectivity, with major road networks ensuring swift access to downtown, the international airport, and other key destinations.
          </p>
          
          <h3 className="font-bold text-lg mb-4">AREAS NEARBY:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-gray-700">Global Village – 5 Minutes</li>
            <li className="text-gray-700">IMG Worlds of Adventure – 10 Minutes</li>
            <li className="text-gray-700">Butterfly Garden – 10 Minutes</li>
            <li className="text-gray-700">City Center – 15 Minutes</li>
            <li className="text-gray-700">International Airport – 20 Minutes</li>
          </ul>
        </div>
        
        {/* Downloads Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Downloads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Download Brochure</h3>
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="Phone" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button 
                  type="button" 
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Download
                </button>
              </form>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Download Floorplan</h3>
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="Phone" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button 
                  type="button" 
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Download
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Enquiry Form */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Enquire About {property.title}</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input 
                  type="tel" 
                  placeholder="Phone" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Russian">Russian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Urdu">Urdu</option>
                </select>
              </div>
              <button 
                type="button" 
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        
        {/* You May Also Like Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">You May Also Like:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Property Image</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">Similar Property {index + 1}</h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <p className="text-gray-500 text-sm">Developer Name</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Be the first to know about new project launches</h2>
            <form className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
              />
              <button 
                type="button" 
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 