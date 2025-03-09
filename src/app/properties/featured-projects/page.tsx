'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { featuredProperties } from '@/data/properties'
import { Property } from '@/types/property'
import InquiryModal from '@/components/properties/InquiryModal'
import PropertyCard from '@/components/properties/PropertyCard'

export default function FeaturedProjectsPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [favorites, setFavorites] = useState<(number|string)[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false)
  const [sortOption, setSortOption] = useState('featured')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  
  // Initialize properties on component mount
  useEffect(() => {
    // Filter properties with category 'featured'
    setProperties(featuredProperties.filter(property => property.isFeatured));
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
      case 'featured':
      default:
        // Reset to original order of featured properties
        sortedProperties = [...featuredProperties.filter(property => property.isFeatured)]
        break
    }
    
    setProperties(sortedProperties)
  }

  // Handle filtering
  const handleFilter = () => {
    let filteredProperties = [...featuredProperties.filter(property => property.isFeatured)]
    
    // Filter by property type
    if (filterType !== 'all') {
      filteredProperties = filteredProperties.filter(property => property.type === filterType)
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filteredProperties = filteredProperties.filter(property => property.status === filterStatus)
    }
    
    // Apply current sort
    handleSort(sortOption)
    
    setProperties(filteredProperties)
  }

  // Apply filters when filter options change
  useEffect(() => {
    handleFilter()
  }, [filterType, filterStatus])

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

  // Get unique property types for filter from featured properties only
  const propertyTypes = Array.from(new Set(featuredProperties
    .filter(property => property.isFeatured)
    .map(property => property.type)))
  
  // Get unique property statuses for filter from featured properties only
  const propertyStatuses = Array.from(new Set(featuredProperties
    .filter(property => property.isFeatured)
    .map(property => property.status)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center bg-blue-900">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/images/hero-1.jpg" 
            alt="Featured Projects" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h1>
          <p className="text-lg md:text-xl">Discover our selection of premium properties and investment opportunities</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Browse Featured Projects</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select 
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
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
              <p className="text-gray-500 mb-4 text-center max-w-md">No featured projects match your current filters. Try adjusting your filter criteria or price range.</p>
              <button 
                onClick={() => {
                  setFilterStatus('all')
                  const featuredProjs = featuredProperties.filter(property => property.isFeatured)
                  if (featuredProjs.length > 0) {
                    const prices = featuredProjs.map(p => p.price)
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