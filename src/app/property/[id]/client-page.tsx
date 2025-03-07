'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { Playfair_Display } from 'next/font/google';
import Map from '../../../components/Map';
import { Property } from '../../../types/property';

const playfair = Playfair_Display({ subsets: ['latin'] });

interface ClientPropertyPageProps {
  property: Property;
}

export default function ClientPropertyPage({ property }: ClientPropertyPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <>
      <Script
        src="https://maps.googleapis.com/maps/api/js"
        onLoad={() => setIsMapLoaded(true)}
      />
      <main className="min-h-screen bg-white">
        {/* Image Gallery */}
        <div className="relative h-[60vh] md:h-[70vh]">
          <div className="absolute inset-0">
            <Image 
              src={property.images[currentImageIndex] || property.image || '/images/property-placeholder.jpg'} 
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => setCurrentImageIndex(prev => 
              prev === 0 ? (property.images.length - 1) : prev - 1
            )}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white transition-colors shadow-lg"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => setCurrentImageIndex(prev => 
              prev === (property.images.length - 1) ? 0 : prev + 1
            )}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white transition-colors shadow-lg"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            {currentImageIndex + 1} / {property.images.length}
          </div>

          {/* Thumbnails Toggle */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-white transition-colors"
          >
            {showThumbnails ? 'Hide Thumbnails' : 'Show Thumbnails'}
          </button>

          {/* Thumbnails */}
          {showThumbnails && (
            <div className="absolute bottom-20 left-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg overflow-x-auto">
              <div className="flex space-x-4">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className={`${playfair.className} text-3xl md:text-4xl font-bold mb-4 md:mb-0`}>
                  {property.title}
                </h1>
                <p className="text-2xl text-blue-600 font-semibold">
                  ${property.price.toLocaleString()}
                </p>
              </div>
              
              {/* Location and Type */}
              <div className="flex items-center space-x-4 mb-8 text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.location}
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {property.type}
                </div>
              </div>
              
              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-blue-600">{property.beds}</div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-blue-600">{property.baths}</div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-blue-600">{property.area.toLocaleString()}</div>
                  <div className="text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-blue-600">{property.yearBuilt}</div>
                  <div className="text-gray-600">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Overview</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{property.description}</p>
              </div>

              {/* Features & Amenities */}
              <div className="mb-8">
                <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(property.features || property.amenities || []).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {property.address && (
                <div className="mb-8">
                  <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Address</h2>
                  <p className="text-gray-600 mb-6">{property.address}</p>
                </div>
              )}

              {/* Map Section */}
              <div>
                <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Location</h2>
                <div className="h-[400px] rounded-lg overflow-hidden">
                  {isMapLoaded && (
                    <Map 
                      center={property.coordinates} 
                      zoom={15} 
                      markers={[{
                        position: property.coordinates,
                        title: property.title
                      }]}
                      address={property.address || property.location}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              {/* Developer Info */}
              <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-6">
                <h3 className={`${playfair.className} text-xl font-bold mb-4`}>Developer</h3>
                <p className="text-gray-700 mb-2">{property.developer}</p>
              </div>

              {/* Agent Info */}
              {property.agent && (
                <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-6">
                  <h3 className={`${playfair.className} text-xl font-bold mb-4`}>Contact Agent</h3>
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                      <Image 
                        src={property.agent.image} 
                        alt={property.agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{property.agent.name}</p>
                      <p className="text-sm text-gray-600">{property.agent.role}</p>
                      <p className="text-sm text-gray-600">{property.agent.phone}</p>
                      <p className="text-sm text-gray-600">{property.agent.email}</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
                    Contact Agent
                  </button>
                </div>
              )}

              {/* Inquiry Form */}
              <div className="bg-gray-50 rounded-lg shadow-sm p-6">
                <h3 className={`${playfair.className} text-xl font-bold mb-4`}>Request Information</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      id="name"
                      type="text"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      id="email"
                      type="email"
                      placeholder="Your Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      id="phone"
                      type="tel"
                      placeholder="Your Phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      id="message"
                      rows={4}
                      placeholder="I'm interested in this property..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 