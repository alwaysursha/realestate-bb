import Image from 'next/image'
import Link from 'next/link'
import HeroSection from '@/components/home/HeroSection'
import DevelopersSection from '@/components/developers/DevelopersSection'

const featuredProperties = [
  {
    id: 1,
    title: 'Luxury Villa in Palm Jumeirah',
    location: 'Palm Jumeirah, Dubai',
    price: 5500000,
    type: 'Villa',
    beds: 5,
    baths: 6,
    area: 7500,
    image: '/images/properties/villa-1.jpg',
  },
  {
    id: 2,
    title: 'Modern Apartment in Downtown',
    location: 'Downtown Dubai',
    price: 2800000,
    type: 'Apartment',
    beds: 2,
    baths: 2.5,
    area: 1200,
    image: '/images/properties/apartment-1.jpg',
  },
  {
    id: 3,
    title: 'Penthouse with Marina View',
    location: 'Dubai Marina',
    price: 7200000,
    type: 'Penthouse',
    beds: 4,
    baths: 4.5,
    area: 3800,
    image: '/images/properties/penthouse-1.jpg',
  }
]

const apartments = [
  {
    id: 1,
    title: 'Luxury Apartment in Dubai Marina',
    location: 'Dubai Marina',
    price: 2800000,
    type: 'Apartment',
    beds: 2,
    baths: 2.5,
    area: 1350,
    image: '/images/properties/apartment-2.jpg',
  },
  {
    id: 2,
    title: 'Downtown Boulevard View Apartment',
    location: 'Downtown Dubai',
    price: 3500000,
    type: 'Apartment',
    beds: 3,
    baths: 3,
    area: 1800,
    image: '/images/properties/apartment-3.jpg',
  },
  {
    id: 3,
    title: 'Business Bay Modern Apartment',
    location: 'Business Bay',
    price: 2200000,
    type: 'Apartment',
    beds: 2,
    baths: 2,
    area: 1200,
    image: '/images/properties/apartment-4.jpg',
  }
]

const houses = [
  {
    id: 1,
    title: 'Luxury Villa in Emirates Hills',
    location: 'Emirates Hills',
    price: 15000000,
    type: 'Villa',
    beds: 6,
    baths: 7,
    area: 8500,
    image: '/images/properties/villa-2.jpg',
  },
  {
    id: 2,
    title: 'Modern Villa in Arabian Ranches',
    location: 'Arabian Ranches',
    price: 8500000,
    type: 'Villa',
    beds: 5,
    baths: 5.5,
    area: 6200,
    image: '/images/properties/villa-3.jpg',
  },
  {
    id: 3,
    title: 'Family Villa in The Springs',
    location: 'The Springs',
    price: 4500000,
    type: 'Villa',
    beds: 4,
    baths: 4,
    area: 3800,
    image: '/images/properties/villa-4.jpg',
  }
]

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Featured Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our handpicked selection of premium properties</p>
          </div>
          <div className="relative pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
              {/* Property Card 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative pb-[66.666667%]">
                  <img
                    src="/images/properties/villa-1.jpg"
                    alt="Luxury Villa"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md">
                    Villa
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Luxury Palm Villa</h3>
                  <p className="text-gray-600 mb-4">Palm Jumeirah, Dubai</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">AED 12,500,000</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <span>4 Beds</span>
                    <span>•</span>
                    <span>5 Baths</span>
                    <span>•</span>
                    <span>5,200 sqft</span>
                  </div>
                </div>
              </div>

              {/* Property Card 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative pb-[66.666667%]">
                  <img
                    src="/images/properties/apartment-1.jpg"
                    alt="Modern Apartment"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md">
                    Apartment
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Modern Downtown Apartment</h3>
                  <p className="text-gray-600 mb-4">Downtown Dubai</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">AED 3,800,000</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <span>2 Beds</span>
                    <span>•</span>
                    <span>2.5 Baths</span>
                    <span>•</span>
                    <span>1,850 sqft</span>
                  </div>
                </div>
              </div>

              {/* Property Card 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative pb-[66.666667%]">
                  <img
                    src="/images/properties/penthouse-1.jpg"
                    alt="Luxury Penthouse"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md">
                    Penthouse
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Marina Penthouse</h3>
                  <p className="text-gray-600 mb-4">Dubai Marina</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">AED 15,900,000</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <span>4 Beds</span>
                    <span>•</span>
                    <span>4.5 Baths</span>
                    <span>•</span>
                    <span>6,100 sqft</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0">
              <Link 
                href="/properties" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 hover:shadow-lg group"
              >
                <span className="mr-2">View All Projects</span>
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
        </div>
      </section>

      {/* Apartments Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Apartments . Penthouses</h2>
              <p className="text-gray-600">Luxury living spaces in Dubai's most sought-after locations</p>
            </div>
            <Link href="/properties/apartments" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              View All Apartments
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartments.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="relative pb-[66.666667%]">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md">
                    {property.type}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">AED {property.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <span>{property.beds} Beds</span>
                    <span>•</span>
                    <span>{property.baths} Baths</span>
                    <span>•</span>
                    <span>{property.area.toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Houses Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Villas . Semis . Towns</h2>
              <p className="text-gray-600">Exclusive villas and townhouses for the discerning buyer</p>
            </div>
            <Link href="/properties/houses" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              View All Houses
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {houses.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="relative pb-[66.666667%]">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md">
                    {property.type}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">AED {property.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <span>{property.beds} Beds</span>
                    <span>•</span>
                    <span>{property.baths} Baths</span>
                    <span>•</span>
                    <span>{property.area.toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <DevelopersSection />

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Trusted by Thousands</h3>
              <p className="text-gray-600">Over 10,000 satisfied customers have found their dream properties through us.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast & Efficient</h3>
              <p className="text-gray-600">Our streamlined process ensures quick and hassle-free property transactions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Personalized Service</h3>
              <p className="text-gray-600">Our expert agents provide tailored solutions to meet your specific needs.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
