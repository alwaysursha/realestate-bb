'use client';

import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Agent, AgentCreateInput, AgentStatus, AgentSpecialization, AgentLanguage } from '@/types/agent';
import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image';
import { 
  UserCircleIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  DocumentTextIcon,
  CalendarIcon,
  StarIcon,
  ChartBarIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import AgentForm from '@/components/AgentForm';

export default function AdminAgents() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<AgentStatus | 'all'>('all');
  const [filterSpecialization, setFilterSpecialization] = useState<AgentSpecialization | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchAgents();
    }
  }, [isAuthenticated]);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch agents');
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    const matchesSpecialization = filterSpecialization === 'all' || 
      agent.specializations.includes(filterSpecialization);
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSpecialization && matchesSearch;
  });

  const handleCreateAgent = async (input: AgentCreateInput) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      
      if (!response.ok) throw new Error('Failed to create agent');
      
      const newAgent = await response.json();
      setAgents(prev => [...prev, newAgent]);
      toast.success('Agent created successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to create agent');
    }
  };

  const handleUpdateStatus = async (agentId: string, status: AgentStatus) => {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', data: { status } })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      const updatedAgent = await response.json();
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? updatedAgent : agent
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <div>Access denied. Please log in as admin.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agents Management</h1>
        <button
          onClick={() => {
            setSelectedAgent(undefined);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5" />
          Add Agent
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search agents..."
          className="border rounded-lg px-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border rounded-lg px-4 py-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as AgentStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          className="border rounded-lg px-4 py-2"
          value={filterSpecialization}
          onChange={(e) => setFilterSpecialization(e.target.value as AgentSpecialization | 'all')}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              {agent.photo ? (
                <Image
                  src={agent.photo}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <UserCircleIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  <p className="text-gray-600">{agent.title}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  agent.status === 'Active' ? 'bg-green-100 text-green-800' :
                  agent.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {agent.status}
                </span>
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

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  View Details
                </button>
                <select
                  value={agent.status}
                  onChange={(e) => handleUpdateStatus(agent.id, e.target.value as AgentStatus)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Modal */}
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 pr-4 pt-4">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        {selectedAgent ? 'Agent Details' : 'Create New Agent'}
                      </Dialog.Title>
                      <div className="mt-4">
                        <AgentForm
                          agent={selectedAgent}
                          onSubmit={handleCreateAgent}
                          onCancel={() => setIsModalOpen(false)}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
} 