'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { featuredProperties } from '@/data/properties'
import { Property } from '@/types/property'
import InquiryModal from '@/components/properties/InquiryModal'

export default function VillasTownhousesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [favorites, setFavorites] = useState<(number|string)[]>([])
  const [sortOption, setSortOption] = useState('featured')
  const [filterBedrooms, setFilterBedrooms] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false)
  
  // Initialize properties on component mount
  useEffect(() => {
    // Filter properties with type 'Villa' or 'Townhouse'
    const villasAndTownhouses = featuredProperties.filter(
      property => property.type === 'Villa' || property.type === 'Townhouse'
    )
    setProperties(villasAndTownhouses)
    
    // Set initial price range based on min and max prices
    if (villasAndTownhouses.length > 0) {
      const prices = villasAndTownhouses.map(p => p.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      setPriceRange([minPrice, maxPrice])
    }
  }, [])

  // Handle sorting
  const handleSort = (option: string) => {
    setSortOption(option)
    let sortedProperties = [...properties]
    
    switch(option) {
      case 'price-asc':
        sortedProperties.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sortedProperties.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        sortedProperties.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0))
        break
      case 'beds-asc':
        sortedProperties.sort((a, b) => a.beds - b.beds)
        break
      case 'beds-desc':
        sortedProperties.sort((a, b) => b.beds - a.beds)
        break
      case 'featured':
      default:
        // Reset to original order but keep only villas and townhouses
        sortedProperties = featuredProperties.filter(
          property => property.type === 'Villa' || property.type === 'Townhouse'
        )
        break
    }
    
    setProperties(sortedProperties)
  }

  // Handle filtering
  const handleFilter = () => {
    let filteredProperties = featuredProperties.filter(
      property => property.type === 'Villa' || property.type === 'Townhouse'
    )
    
    // Filter by bedrooms
    if (filterBedrooms !== 'all') {
      const bedroomCount = parseInt(filterBedrooms)
      filteredProperties = filteredProperties.filter(property => property.beds === bedroomCount)
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filteredProperties = filteredProperties.filter(property => property.status === filterStatus)
    }
    
    // Filter by price range
    filteredProperties = filteredProperties.filter(
      property => property.price >= priceRange[0] && property.price <= priceRange[1]
    )
    
    // Apply current sort
    let sortedProperties = [...filteredProperties]
    
    switch(sortOption) {
      case 'price-asc':
        sortedProperties.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sortedProperties.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        sortedProperties.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0))
        break
      case 'beds-asc':
        sortedProperties.sort((a, b) => a.beds - b.beds)
        break
      case 'beds-desc':
        sortedProperties.sort((a, b) => b.beds - a.beds)
        break
    }
    
    setProperties(sortedProperties)
  }

  // Apply filters when filter options change
  useEffect(() => {
    handleFilter()
  }, [filterBedrooms, filterStatus, priceRange])

  // Toggle favorite
  const toggleFavorite = (id: number | string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    )
  }

  // Handle email inquiry
  const handleEmailInquiry = (property: Property, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedProperty(property)
    setIsInquiryModalOpen(true)
  }

  // Handle share
  const handleShare = (property: Property, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this ${property.type} in ${property.location}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Share feature is not supported in your browser. You can copy the URL and share it manually.')
    }
  }

  // Get unique bedroom counts for filter
  const bedroomCounts = Array.from(
    new Set(
      featuredProperties
        .filter(property => property.type === 'Villa' || property.type === 'Townhouse')
        .map(property => property.beds)
    )
  ).sort((a, b) => a - b)
  
  // Get unique property statuses for filter
  const propertyStatuses = Array.from(
    new Set(
      featuredProperties
        .filter(property => property.type === 'Villa' || property.type === 'Townhouse')
        .map(property => property.status)
    )
  )

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center bg-blue-900">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/images/hero-1.jpg" 
            alt="Villas & Townhouses" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Villas & Townhouses</h1>
          <p className="text-lg md:text-xl">Discover exclusive family homes with private gardens and premium amenities</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Browse Villas & Townhouses</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select 
                  className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                  value={sortOption}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="beds-asc">Bedrooms: Low to High</option>
                  <option value="beds-desc">Bedrooms: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <select 
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                value={filterBedrooms}
                onChange={(e) => setFilterBedrooms(e.target.value)}
              >
                <option value="all">All Bedrooms</option>
                {bedroomCounts.map(count => (
                  <option key={count} value={count}>{count} {count === 1 ? 'Bedroom' : 'Bedrooms'}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 mt-6">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {propertyStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 mt-6">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="mt-2 mb-6 relative">
                {/* Track background */}
                <div className="h-2 bg-gray-200 rounded-full w-full absolute top-0"></div>
                
                {/* Colored track between thumbs */}
                <div 
                  className="h-2 bg-blue-500 rounded-full absolute top-0"
                  style={{
                    left: `${((priceRange[0] - (featuredProperties.length > 0 ? Math.min(...featuredProperties.map(p => p.price)) : 0)) / ((featuredProperties.length > 0 ? Math.max(...featuredProperties.map(p => p.price)) : 10000000) - (featuredProperties.length > 0 ? Math.min(...featuredProperties.map(p => p.price)) : 0))) * 100}%`,
                    width: `${((priceRange[1] - priceRange[0]) / ((featuredProperties.length > 0 ? Math.max(...featuredProperties.map(p => p.price)) : 10000000) - (featuredProperties.length > 0 ? Math.min(...featuredProperties.map(p => p.price)) : 0))) * 100}%`
                  }}
                ></div>
                
                {/* Min thumb */}
                <input 
                  type="range" 
                  min={featuredProperties.length > 0 ? Math.min(...featuredProperties.map(p => p.price)) : 0}
                  max={featuredProperties.length > 0 ? Math.max(...featuredProperties.map(p => p.price)) : 10000000}
                  value={priceRange[0]} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value < priceRange[1]) {
                      setPriceRange([value, priceRange[1]]);
                    }
                  }}
                  className="absolute top-0 h-2 w-full appearance-none bg-transparent cursor-pointer"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    pointerEvents: 'auto',
                    zIndex: 3,
                  }}
                />
                
                {/* Max thumb */}
                <input 
                  type="range" 
                  min={featuredProperties.length > 0 ? Math.min(...featuredProperties.map(p => p.price)) : 0}
                  max={featuredProperties.length > 0 ? Math.max(...featuredProperties.map(p => p.price)) : 10000000}
                  value={priceRange[1]} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > priceRange[0]) {
                      setPriceRange([priceRange[0], value]);
                    }
                  }}
                  className="absolute top-0 h-2 w-full appearance-none bg-transparent cursor-pointer"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    pointerEvents: 'auto',
                    zIndex: 4,
                  }}
                />
                
                <style jsx>{`
                  input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background-color: #3b82f6;
                    border-radius: 50%;
                    box-shadow: 0 0 0 1px #C6C6C6;
                    cursor: pointer;
                    pointer-events: auto;
                  }
                  
                  input[type=range]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background-color: #3b82f6;
                    border-radius: 50%;
                    box-shadow: 0 0 0 1px #C6C6C6;
                    cursor: pointer;
                    pointer-events: auto;
                  }
                  
                  input[type=range]::-ms-thumb {
                    width: 16px;
                    height: 16px;
                    background-color: #3b82f6;
                    border-radius: 50%;
                    box-shadow: 0 0 0 1px #C6C6C6;
                    cursor: pointer;
                    pointer-events: auto;
                  }
                  
                  input[type=range]::-webkit-slider-runnable-track,
                  input[type=range]::-moz-range-track,
                  input[type=range]::-ms-track {
                    background: transparent;
                    cursor: pointer;
                  }
                `}</style>
              </div>
              
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? (
            properties.map(property => (
              <Link href={`/property/${property.id}`} key={property.id} className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="relative pb-[66.666667%]">
                    <Image
                      src={property.image || '/images/property-placeholder.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
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
                  <div className="p-6">
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
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.beds} Beds
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {property.baths} Baths
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                        {property.area.toLocaleString()} sqft
                      </span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-600">Developer:</span>
                        <span className="ml-1 text-xs font-medium text-gray-800">{property.developer}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => handleEmailInquiry(property, e)}
                          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button 
                          onClick={(e) => handleShare(property, e)}
                          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-4 text-center max-w-md">No villas or townhouses match your current filters. Try adjusting your filter criteria or price range.</p>
              <button 
                onClick={() => {
                  setFilterBedrooms('all')
                  setFilterStatus('all')
                  const villasAndTownhouses = featuredProperties.filter(
                    property => property.type === 'Villa' || property.type === 'Townhouse'
                  )
                  if (villasAndTownhouses.length > 0) {
                    const prices = villasAndTownhouses.map(p => p.price)
                    const minPrice = Math.min(...prices)
                    const maxPrice = Math.max(...prices)
                    setPriceRange([minPrice, maxPrice])
                  }
                }}
                className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedProperty && (
        <InquiryModal
          isOpen={isInquiryModalOpen}
          onClose={() => {
            setIsInquiryModalOpen(false)
            setSelectedProperty(null)
          }}
          property={selectedProperty}
        />
      )}
    </div>
  )
} 