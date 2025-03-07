'use client'

import React, { useEffect, useRef, useState } from 'react'

interface MapProps {
  center: {
    lat: number
    lng: number
  }
  zoom: number
  markers?: Array<{
    position: {
      lat: number
      lng: number
    }
    title?: string
  }>
  address?: string
}

// Declare global Google Maps types
declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

const Map: React.FC<MapProps> = ({ center, zoom, markers = [], address }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [mapMarkers, setMapMarkers] = useState<any[]>([])

  // Load Google Maps script
  useEffect(() => {
    // Skip if already loaded
    if (window.google?.maps) {
      setMapLoaded(true)
      return
    }

    // Create callback function for script
    window.initMap = () => {
      setMapLoaded(true)
    }

    // Load script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?callback=initMap`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // Clean up
      window.initMap = () => {}
      // Remove script if component unmounts before loading
      if (!window.google?.maps) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    // Create map
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    })

    setMapInstance(map)

    // Clean up function
    return () => {
      setMapInstance(null)
    }
  }, [mapLoaded, center, zoom])

  // Handle markers
  useEffect(() => {
    if (!mapInstance) return

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null))
    
    // Create new markers
    const newMarkers = markers.map(marker => {
      return new window.google.maps.Marker({
        position: marker.position,
        map: mapInstance,
        title: marker.title,
        animation: window.google.maps.Animation.DROP,
      })
    })

    setMapMarkers(newMarkers)

    // Clean up function
    return () => {
      newMarkers.forEach(marker => marker.setMap(null))
      setMapMarkers([])
    }
  }, [mapInstance, markers])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg"></div>
      {address && mapLoaded && (
        <div className="absolute bottom-4 right-4">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </a>
        </div>
      )}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-lg">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}
    </div>
  )
}

export default Map 