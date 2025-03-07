'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Agent } from '@/types/agent';
import { UserCircleIcon, PhoneIcon, EnvelopeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = filterSpecialization === 'all' || 
                                agent.specializations.includes(filterSpecialization as any);
    return matchesSearch && matchesSpecialization;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <Image
          src="/images/agents-hero.jpg"
          alt="Real Estate Agents"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4 text-center">
            Meet Our Expert Agents
          </h1>
          <p className="text-xl max-w-2xl text-center px-4">
            Our team of experienced professionals is here to help you find your perfect property
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{agents.length}</div>
            <div className="text-gray-600">Expert Agents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {agents.reduce((sum, agent) => sum + agent.performance.soldProperties, 0)}
            </div>
            <div className="text-gray-600">Properties Sold</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {agents.reduce((sum, agent) => sum + agent.performance.activeListings, 0)}
            </div>
            <div className="text-gray-600">Active Listings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {(agents.reduce((sum, agent) => sum + agent.performance.averageRating, 0) / agents.length).toFixed(1)}
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Agents
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by name or email..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Specialization
              </label>
              <select
                id="specialization"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
              >
                <option value="all">All Specializations</option>
                <option value="Luxury">Luxury</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Off-Plan">Off-Plan</option>
                <option value="International">International</option>
              </select>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                {agent.photo ? (
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <UserCircleIcon className="h-32 w-32 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{agent.name}</h3>
                  <p className="text-gray-600">{agent.title}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span className="text-sm">{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <PhoneIcon className="h-4 w-4" />
                    <span className="text-sm">{agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DocumentTextIcon className="h-4 w-4" />
                    <span className="text-sm">License: {agent.licenseNumber}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.specializations.map(spec => (
                    <span key={spec} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold">{agent.performance.activeListings}</div>
                      <div className="text-gray-600">Active</div>
                    </div>
                    <div>
                      <div className="font-semibold">{agent.performance.soldProperties}</div>
                      <div className="text-gray-600">Sold</div>
                    </div>
                    <div>
                      <div className="font-semibold">{agent.performance.averageRating.toFixed(1)}</div>
                      <div className="text-gray-600">Rating</div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                  Contact Agent
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 