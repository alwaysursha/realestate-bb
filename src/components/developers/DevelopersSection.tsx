'use client'

import { useState, useEffect, useRef, TouchEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Developer } from '@/data/developers'
import * as developersService from '@/services/developersService'

export default function DevelopersSection() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(4)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  
  // Touch event handling
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  
  const sliderRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const loadDevelopers = async () => {
      try {
        const data = await developersService.getActiveDevelopers()
        setDevelopers(data)
      } catch (error) {
        console.error('Error loading developers:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDevelopers()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1)
      } else if (window.innerWidth < 768) {
        setCardsToShow(2)
      } else if (window.innerWidth < 1024) {
        setCardsToShow(3)
      } else {
        setCardsToShow(4)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const totalSlides = Math.max(Math.ceil(developers.length / cardsToShow) - 1, 0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides : prev - 1))
  }

  const startAutoplay = () => {
    stopAutoplay()
    autoplayRef.current = setInterval(nextSlide, 5000)
  }

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = undefined
    }
  }

  useEffect(() => {
    startAutoplay()
    return () => stopAutoplay()
  }, [totalSlides])

  const handleTouchStart = (e: TouchEvent) => {
    stopAutoplay()
    setIsDragging(true)
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    setTouchEnd(e.targetTouches[0].clientX)
    e.preventDefault() // Prevent scrolling while swiping
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false)
      return
    }
    
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }

    setTouchStart(0)
    setTouchEnd(0)
    setIsDragging(false)
    startAutoplay()
  }

  const handleImageError = (developerId: string) => {
    setFailedImages((prev) => ({ ...prev, [developerId]: true }))
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Premier Developers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover properties from UAE's most trusted and renowned real estate developers,
              known for their commitment to quality and innovation.
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Premier Developers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover properties from UAE's most trusted and renowned real estate developers,
            known for their commitment to quality and innovation.
          </p>
        </div>
        
        <div className="relative px-4">
          <button 
            onClick={() => {
              prevSlide()
              stopAutoplay()
              startAutoplay()
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors md:flex hidden"
            aria-label="Previous developers"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div 
            ref={sliderRef}
            className="overflow-hidden touch-pan-y select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className={`flex transition-transform duration-500 ease-out ${isDragging ? 'cursor-grabbing' : ''}`}
              style={{ 
                transform: touchStart && touchEnd 
                  ? `translateX(calc(-${currentSlide * 100}% - ${touchStart - touchEnd}px))`
                  : `translateX(-${currentSlide * 100}%)`,
                transition: touchStart && touchEnd ? 'none' : 'transform 500ms ease-out'
              }}
            >
              {Array.from({ length: Math.ceil(developers.length / cardsToShow) }).map((_, index) => (
                <div 
                  key={index} 
                  className={`flex-none w-full grid gap-6 px-4 ${
                    cardsToShow === 1 ? 'grid-cols-1' : 
                    cardsToShow === 2 ? 'grid-cols-2' : 
                    cardsToShow === 3 ? 'grid-cols-3' :
                    'grid-cols-4'
                  }`}
                >
                  {developers.slice(index * cardsToShow, (index + 1) * cardsToShow).map((developer) => (
                    <Link 
                      href={`/developers/${developer.slug}`}
                      key={developer.slug}
                      className="group bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      onClick={(e) => {
                        if (isDragging) {
                          e.preventDefault()
                        }
                      }}
                    >
                      <div className="h-20 mb-4 relative flex items-center justify-center bg-white rounded-md p-2">
                        {failedImages[developer.id] ? (
                          <span className="text-lg font-semibold text-gray-600">
                            {developer.name}
                          </span>
                        ) : (
                          <Image
                            src={developer.logo}
                            alt={`${developer.name} logo`}
                            width={160}
                            height={80}
                            className="object-contain transition-transform duration-300 group-hover:scale-105 max-h-16"
                            onError={() => handleImageError(developer.id)}
                            unoptimized={true}
                          />
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {developer.name}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {developer.description}
                      </p>
                      
                      <div className="flex justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{developer.projectCount} Projects</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Est. {developer.establishedYear}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => {
              nextSlide()
              stopAutoplay()
              startAutoplay()
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors md:flex hidden"
            aria-label="Next developers"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSlides + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index)
                  stopAutoplay()
                  startAutoplay()
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-blue-600 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/developers"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 hover:shadow-lg group"
          >
            <span className="mr-2">View All Developers</span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
} 