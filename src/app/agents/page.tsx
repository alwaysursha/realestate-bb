'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Agent } from '@/types/agent';
import { UserCircleIcon, PhoneIcon, EnvelopeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { agentService } from '@/services/agentService';

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
      const data = await agentService.getAgents();
      setAgents(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === '' || 
                         agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = filterSpecialization === 'all' || 
                               (agent.specializations && agent.specializations.includes(filterSpecialization as any));
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
          src="/images/hero/agents-hero.jpg"
          alt="Our Agents"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Expert Agents</h1>
            <p className="text-xl md:text-2xl">Meet our team of professional real estate agents</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Specializations</option>
            <option value="Luxury">Luxury</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
            <option value="Off-Plan">Off-Plan</option>
            <option value="International">International</option>
          </select>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64 w-full">
                {agent.profileImage ? (
                  <Image
                    src={agent.profileImage}
                    alt={agent.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <UserCircleIcon className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
                <p className="text-gray-600 mb-4">{agent.title}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    <span>{agent.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    <span>RERA: {agent.licenseNumber}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Specializations:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.specializations && agent.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Languages:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.languages && agent.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold">{agent.experience || 0} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Properties</p>
                    <p className="font-semibold">{agent.properties?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold">{agent.rating || 0}/5</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Reviews</p>
                    <p className="font-semibold">{agent.reviews || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 