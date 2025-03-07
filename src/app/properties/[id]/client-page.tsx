'use client'

import { useState } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { Playfair_Display } from 'next/font/google'
import Map from '@/components/Map'
import { Property } from '@/types/property'

const playfair = Playfair_Display({ subsets: ['latin'] })

interface ClientPropertyPageProps {
  property: Property;
}

export default function ClientPropertyPage({ property }: ClientPropertyPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        onLoad={() => setIsMapLoaded(true)}
      />
      <main className="min-h-screen bg-white">
        {/* Image Gallery */}
        <div className="relative h-[60vh] md:h-[70vh]">
          <div className="absolute inset-0">
            <Image
              src={property.images[currentImageIndex]}
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
              prev === 0 ? property.images.length - 1 : prev - 1
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
              prev === property.images.length - 1 ? 0 : prev + 1
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
                      currentImageIndex === index ? 'ring-2 ring-yellow-500' : ''
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
                <p className="text-2xl text-yellow-600 font-semibold">
                  AED {property.price.toLocaleString()}
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
                  <div className="text-2xl font-bold text-yellow-600">{property.beds}</div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-yellow-600">{property.baths}</div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-yellow-600">{property.area.toLocaleString()}</div>
                  <div className="text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-yellow-600">{property.yearBuilt}</div>
                  <div className="text-gray-600">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div>
                <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Location</h2>
                {isMapLoaded && (
                  <Map
                    center={property.coordinates}
                    zoom={15}
                    markers={[
                      {
                        position: property.coordinates,
                        title: property.title
                      }
                    ]}
                    address={property.address}
                  />
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                {/* Agent Info */}
                {property.agent && (
                  <div className="flex items-center mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                      <Image
                        src={property.agent.image}
                        alt={property.agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{property.agent.name}</h3>
                      <p className="text-sm text-gray-600">{property.agent.role}</p>
                      <p className="text-sm text-gray-600">{property.agent.phone}</p>
                      <p className="text-sm text-gray-600">{property.agent.email}</p>
                    </div>
                  </div>
                )}

                <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Contact Agent</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="I'm interested in this property..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-white py-3 px-4 rounded-md hover:bg-yellow-400 transition-colors font-medium"
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
  )
} 