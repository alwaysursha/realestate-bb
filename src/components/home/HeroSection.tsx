'use client'

import React, { useState, useEffect } from 'react'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })

// Update this array with your own images and text
const heroImages = [
  {
    url: '/images/hero-1.jpg', // Replace with your first hero image
  },
  {
    url: '/images/hero-2.jpg', // Replace with your second hero image
  },
  {
    url: '/images/hero-3.jpg', // Replace with your third hero image
  },
]

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [citySetIndex, setCitySetIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // City sets for alternating display
  const citySets = [
    [
      { name: 'DUBAI', hover: false },
      { name: 'ABU DHABI', hover: false },
      { name: 'SHARJAH', hover: false }
    ],
    [
      { name: 'AJMAN', hover: false },
      { name: 'RAS AL-KHAIMAH', mobileAbbr: 'RAK', hover: false },
      { name: 'UMM AL-QUWAIN', mobileAbbr: 'UAQ', hover: false }
    ]
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 7000) // Change image every 7 seconds

    return () => clearInterval(interval)
  }, [])

  // Add effect for city text rotation
  useEffect(() => {
    const cityRotationInterval = setInterval(() => {
      setIsTransitioning(true)
      
      // Wait for fade out animation to complete
      setTimeout(() => {
        setCitySetIndex(prevIndex => (prevIndex === 0 ? 1 : 0))
        
        // Start fade in animation
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 500) // This should match the CSS transition duration
      
    }, 5000) // Change sets every 5 seconds
    
    return () => clearInterval(cityRotationInterval)
  }, [])

  const handleScrollDown = () => {
    // Find the featured projects section element
    const featuredSection = document.querySelector('section.bg-gray-50');
    
    if (featuredSection) {
      // Get exact position of the featured section
      const featuredSectionPosition = featuredSection.getBoundingClientRect().top + window.scrollY;
      
      // Add a moderate offset to ensure more of the section is visible
      // Use appropriate offset for each device type
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? -40 : -40;
      
      // Scroll to the calculated position
      window.scrollTo({
        top: featuredSectionPosition + offset,
        behavior: 'smooth'
      });
    } else {
      // Fallback if we can't find the section by class
      const isMobile = window.innerWidth < 768;
      const headerHeight = isMobile ? 64 : 96;
      const additionalOffset = isMobile ? 100 : 120; // Increased fallback offset values
      const scrollTarget = window.innerHeight - headerHeight + additionalOffset;
      
      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Image Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out transform ${
              index === currentImageIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-110'
            }`}
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              willChange: 'transform, opacity',
            }}
          >
            {/* Dark Overlay with gradient */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"
              style={{ willChange: 'opacity' }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col justify-center items-center">
        {/* Static Text */}
        <div className="w-full max-w-5xl mx-auto text-center mb-6 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 text-white whitespace-nowrap md:whitespace-pre-line px-1 md:px-4 leading-tight">
            Find Your Home in UAE
          </h1>
          <div 
            className={`${playfair.className} text-sm sm:text-base md:text-xl lg:text-2xl text-white mx-auto tracking-normal md:tracking-wider overflow-x-auto whitespace-nowrap md:whitespace-normal px-1 md:px-4 pb-2 md:pb-0 hide-scrollbar transition-opacity duration-500 ease-in-out drop-shadow-sm ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          >
            {citySets[citySetIndex].map((city, index) => (
              <React.Fragment key={city.name}>
                {index > 0 && (
                  <span className="inline-block mx-0.5 md:mx-2 text-yellow-400">•</span>
                )}
                <span className="inline-block mx-0.5 md:mx-2 hover:text-yellow-400 transition-colors font-medium">
                  {/* Use abbreviated names on mobile for longer city names */}
                  <span className="md:hidden">
                    {city.mobileAbbr || city.name}
                  </span>
                  <span className="hidden md:inline">
                    {city.name}
                  </span>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg mx-4 mb-12 md:mb-0">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            <div>
              <select className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-white text-gray-900 hover:ring-2 hover:ring-yellow-400 transition-all text-sm md:text-base">
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>
            <div>
              <select className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-white text-gray-900 hover:ring-2 hover:ring-yellow-400 transition-all text-sm md:text-base">
                <option value="">Location</option>
                <option value="downtown">Downtown Dubai</option>
                <option value="marina">Dubai Marina</option>
                <option value="palm">Palm Jumeirah</option>
              </select>
            </div>
            <div>
              <select className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-white text-gray-900 hover:ring-2 hover:ring-yellow-400 transition-all text-sm md:text-base">
                <option value="">Price Range</option>
                <option value="0-500000">Up to 500,000 AED</option>
                <option value="500000-1000000">500,000 - 1M AED</option>
                <option value="1000000+">1M+ AED</option>
              </select>
            </div>
            <div>
              <button className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 transition-all duration-300 text-sm md:text-base font-medium">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Scroll Down Button */}
        <div className="md:absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-center">
          <button 
            onClick={handleScrollDown}
            className="flex flex-col items-center text-white group pb-4 md:pb-6"
            aria-label="Scroll to explore more"
          >
            <span className={`${playfair.className} text-xs md:text-sm font-medium tracking-wider mb-2 group-hover:text-yellow-400 transition-colors`}>
              Scroll Down
            </span>
            <div className="flex flex-col items-center">
              <div className="w-[2px] h-4 md:h-6 bg-white/50 rounded-full overflow-hidden">
                <div className="w-full h-full animate-scrollDown bg-yellow-400" />
              </div>
              <svg 
                className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 mt-1 animate-pulse-slow" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  )
} 