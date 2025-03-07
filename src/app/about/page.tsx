import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <>
      {/* Hero Section with Background Image */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/about-hero.jpg" 
            alt="Modern Dubai skyline" 
            fill 
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">Building dreams and creating opportunities in the UAE real estate market since 2010</p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/about-mission.jpg" 
                alt="Modern office space" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">Our Mission</h2>
              <p className="text-lg mb-6 text-gray-600">
                Founded in 2010, our real estate company has grown from a small local agency to one of the leading property consultants in the UAE. With over a decade of experience in the market, we have helped thousands of clients find their dream homes and make smart investment decisions.
              </p>
              <p className="text-lg mb-6 text-gray-600">
                Our journey began with a simple mission: to provide honest, transparent, and personalized real estate services that put our clients' needs first. This commitment to excellence has been the cornerstone of our success and continues to guide everything we do.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Timeline */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">Our Journey</h2>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-yellow-400"></div>
            
            {/* Timeline Items */}
            <div className="space-y-24 relative">
              {/* 2010 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-16 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">2010: The Beginning</h3>
                  <p className="text-gray-600">Started as a small agency with just 3 agents focusing on residential properties in Dubai Marina.</p>
                </div>
                <div className="md:w-1/2 flex justify-start md:justify-center order-1 md:order-2 mb-6 md:mb-0">
                  <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg z-10">
                    <span className="text-white font-bold">2010</span>
                  </div>
                </div>
              </div>
              
              {/* 2015 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 flex justify-end md:justify-center order-1 mb-6 md:mb-0">
                  <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg z-10">
                    <span className="text-white font-bold">2015</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-16 order-2">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">2015: Expansion</h3>
                  <p className="text-gray-600">Expanded our team to 25 agents and opened a second office in Abu Dhabi, broadening our reach across the UAE.</p>
                </div>
              </div>
              
              {/* 2020 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-16 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">2020: Digital Transformation</h3>
                  <p className="text-gray-600">Launched our digital platform, offering virtual tours and online consultations to clients worldwide.</p>
                </div>
                <div className="md:w-1/2 flex justify-start md:justify-center order-1 md:order-2 mb-6 md:mb-0">
                  <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg z-10">
                    <span className="text-white font-bold">2020</span>
                  </div>
                </div>
              </div>
              
              {/* 2025 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 flex justify-end md:justify-center order-1 mb-6 md:mb-0">
                  <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg z-10">
                    <span className="text-white font-bold">2025</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-16 order-2">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">2025: Today</h3>
                  <p className="text-gray-600">Now a team of 100+ professionals, we're one of the leading real estate consultancies in the UAE, with a portfolio of over 5,000 properties.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="h-48 relative">
                <Image 
                  src="/images/value-integrity.jpg" 
                  alt="Handshake representing integrity" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Integrity</h3>
                <p className="text-gray-600">We believe in honest communication and transparent dealings. Our clients' trust is our most valuable asset.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="h-48 relative">
                <Image 
                  src="/images/value-excellence.jpg" 
                  alt="Award representing excellence" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Excellence</h3>
                <p className="text-gray-600">We strive for excellence in every aspect of our service, constantly improving and innovating to exceed expectations.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <div className="h-48 relative">
                <Image 
                  src="/images/value-client.jpg" 
                  alt="Client meeting" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Client-Centric</h3>
                <p className="text-gray-600">Our clients are at the heart of everything we do. We listen, understand, and tailor our services to meet their unique needs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">Meet Our Leadership</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg text-center">
              <div className="h-64 relative">
                <Image 
                  src="/images/team-ceo.jpg" 
                  alt="CEO" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">Ahmed Al Mansouri</h3>
                <p className="text-yellow-500 font-medium mb-4">CEO & Founder</p>
                <p className="text-gray-600 text-sm">With over 20 years of experience in UAE real estate, Ahmed leads our company with vision and integrity.</p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg text-center">
              <div className="h-64 relative">
                <Image 
                  src="/images/team-coo.jpg" 
                  alt="COO" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">Sarah Johnson</h3>
                <p className="text-yellow-500 font-medium mb-4">Chief Operations Officer</p>
                <p className="text-gray-600 text-sm">Sarah ensures our day-to-day operations run smoothly and efficiently to deliver exceptional service.</p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg text-center">
              <div className="h-64 relative">
                <Image 
                  src="/images/team-sales.jpg" 
                  alt="Sales Director" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">Mohammed Al Hashimi</h3>
                <p className="text-yellow-500 font-medium mb-4">Sales Director</p>
                <p className="text-gray-600 text-sm">Mohammed leads our sales team with enthusiasm and a deep understanding of the market dynamics.</p>
              </div>
            </div>
            
            {/* Team Member 4 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg text-center">
              <div className="h-64 relative">
                <Image 
                  src="/images/team-marketing.jpg" 
                  alt="Marketing Director" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">Priya Sharma</h3>
                <p className="text-yellow-500 font-medium mb-4">Marketing Director</p>
                <p className="text-gray-600 text-sm">Priya brings creativity and strategic thinking to our marketing efforts, enhancing our brand presence.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-8 rounded-xl relative">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image 
                    src="/images/testimonial-1.jpg" 
                    alt="Client 1" 
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="pt-12 text-center">
                <p className="text-gray-600 italic mb-6">"Working with this team was a pleasure. They found us our dream apartment in Downtown Dubai within our budget."</p>
                <h4 className="font-bold text-gray-800">Omar & Fatima</h4>
                <p className="text-sm text-yellow-500">Dubai Marina</p>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-8 rounded-xl relative">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image 
                    src="/images/testimonial-2.jpg" 
                    alt="Client 2" 
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="pt-12 text-center">
                <p className="text-gray-600 italic mb-6">"Their investment advice was spot on. My property portfolio has seen significant growth thanks to their expertise."</p>
                <h4 className="font-bold text-gray-800">James Wilson</h4>
                <p className="text-sm text-yellow-500">International Investor</p>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-8 rounded-xl relative">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image 
                    src="/images/testimonial-3.jpg" 
                    alt="Client 3" 
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="pt-12 text-center">
                <p className="text-gray-600 italic mb-6">"The property management services are exceptional. I can rely on them completely to handle my rental properties."</p>
                <h4 className="font-bold text-gray-800">Aisha Al Zaabi</h4>
                <p className="text-sm text-yellow-500">Property Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 bg-gray-800">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
            <p className="text-xl mb-10">Our team of experts is ready to guide you through every step of your real estate journey.</p>
            <Link href="/contact" className="inline-block bg-yellow-500 text-white font-semibold px-10 py-4 rounded-lg hover:bg-yellow-400 transition duration-300 text-lg">
              Contact Us Today
            </Link>
          </div>
        </div>
      </div>
    </>
  )
} 