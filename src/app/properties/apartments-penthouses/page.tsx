'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { featuredProperties } from '@/data/properties'
import { Property } from '@/types/property'
import InquiryModal from '@/components/properties/InquiryModal'
import PropertyCard from '@/components/properties/PropertyCard'

export default function ApartmentsPenthousesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [favorites, setFavorites] = useState<(number|string)[]>([])
  const [sortOption, setSortOption] = useState('featured')
  const [filterBedrooms, setFilterBedrooms] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  
  // Initialize properties on component mount
  useEffect(() => {
    // Filter properties with type 'Apartment' or 'Penthouse'
    const apartmentsAndPenthouses = featuredProperties.filter(
      property => property.type === 'Apartment' || property.type === 'Penthouse'
    )
    setProperties(apartmentsAndPenthouses)
    
    // Set initial price range based on min and max prices
    if (apartmentsAndPenthouses.length > 0) {
      const prices = apartmentsAndPenthouses.map(p => p.price)
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
        sortedProperties.sort((a, b) => {
          const aBeds = a.beds ?? a.bedrooms ?? 0;
          const bBeds = b.beds ?? b.bedrooms ?? 0;
          return aBeds - bBeds;
        });
        break
      case 'beds-desc':
        sortedProperties.sort((a, b) => {
          const aBeds = a.beds ?? a.bedrooms ?? 0;
          const bBeds = b.beds ?? b.bedrooms ?? 0;
          return bBeds - aBeds;
        });
        break
      case 'featured':
      default:
        // Reset to original order but keep only apartments and penthouses
        sortedProperties = featuredProperties.filter(
          property => property.type === 'Apartment' || property.type === 'Penthouse'
        )
        break
    }
    
    setProperties(sortedProperties)
  }

  // Handle filtering
  const handleFilter = () => {
    let filteredProperties = featuredProperties.filter(
      property => property.type === 'Apartment' || property.type === 'Penthouse'
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
        sortedProperties.sort((a, b) => {
          const aBeds = a.beds ?? a.bedrooms ?? 0;
          const bBeds = b.beds ?? b.bedrooms ?? 0;
          return aBeds - bBeds;
        });
        break
      case 'beds-desc':
        sortedProperties.sort((a, b) => {
          const aBeds = a.beds ?? a.bedrooms ?? 0;
          const bBeds = b.beds ?? b.bedrooms ?? 0;
          return bBeds - aBeds;
        });
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
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  // Handle email inquiry
  const handleEmailInquiry = (property: Property, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `mailto:info@builderbookings.com?subject=Inquiry about ${property.title}&body=I am interested in ${property.title} in ${property.location}. Please provide more information.`
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

  // Get unique number of bedrooms for filter
  const bedroomOptions = Array.from(
    new Set(
      featuredProperties
        .filter(property => property.type === 'Apartment' || property.type === 'Penthouse')
        .map(property => property.beds ?? property.bedrooms ?? 0)
        .filter(beds => beds !== undefined)
    )
  ).sort((a, b) => a - b)
  
  // Get unique property statuses for filter
  const propertyStatuses = Array.from(
    new Set(
      featuredProperties
        .filter(property => property.type === 'Apartment' || property.type === 'Penthouse')
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
            src="/images/hero-2.jpg" 
            alt="Apartments & Penthouses" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Apartments & Penthouses</h1>
          <p className="text-lg md:text-xl">Discover luxury living spaces with stunning views and premium amenities</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Browse Apartments & Penthouses</h2>
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
                {bedroomOptions.map(count => (
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
              <div key={property.id} className="h-full w-full">
                <PropertyCard 
                  property={property}
                  isFavorite={property.id ? favorites.includes(property.id) : false}
                  onToggleFavorite={(id, e) => toggleFavorite(id, e)}
                  onShare={(property, e) => handleShare(property, e)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-4 text-center max-w-md">No apartments or penthouses match your current filters. Try adjusting your filter criteria or price range.</p>
              <button 
                onClick={() => {
                  setFilterBedrooms('all')
                  setFilterStatus('all')
                  const apartmentsAndPenthouses = featuredProperties.filter(
                    property => property.type === 'Apartment' || property.type === 'Penthouse'
                  )
                  if (apartmentsAndPenthouses.length > 0) {
                    const prices = apartmentsAndPenthouses.map(p => p.price)
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
    </div>
  )
} 