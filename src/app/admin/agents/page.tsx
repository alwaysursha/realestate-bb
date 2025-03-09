'use client';

import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Agent, AgentCreateInput, AgentUpdateInput, AgentStatus, AgentSpecialization } from '@/types/agent';
import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image';
import { 
  UserCircleIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  DocumentTextIcon,
  PencilIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import AgentForm from '@/components/AgentForm';
import { agentService } from '@/services/agentService';

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
      const data = await agentService.getAgents();
      setAgents(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch agents');
      setLoading(false);
    }
  };

  const handleCreateAgent = async (input: AgentCreateInput) => {
    try {
      const newAgent = await agentService.createAgent(input);
      setAgents(prev => [...prev, newAgent]);
      toast.success('Agent created successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to create agent');
    }
  };

  const handleUpdateAgent = async (id: string, input: AgentUpdateInput) => {
    try {
      const updatedAgent = await agentService.updateAgent(id, input);
      if (updatedAgent) {
        setAgents(prev => prev.map(agent => 
          agent.id === id ? updatedAgent : agent
        ));
        toast.success('Agent updated successfully');
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error('Failed to update agent');
    }
  };

  const handleUpdateStatus = async (agentId: string, status: AgentStatus) => {
    try {
      const updatedAgent = await agentService.updateAgentStatus(agentId, status);
      if (updatedAgent) {
        setAgents(prev => prev.map(agent => 
          agent.id === agentId ? updatedAgent : agent
        ));
        toast.success('Status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      const success = await agentService.deleteAgent(agentId);
      if (success) {
        setAgents(prev => prev.filter(agent => agent.id !== agentId));
        toast.success('Agent deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete agent');
    }
  };

  const handleFormSubmit = async (input: AgentCreateInput | AgentUpdateInput) => {
    if (selectedAgent) {
      await handleUpdateAgent(selectedAgent.id, input as AgentUpdateInput);
    } else {
      await handleCreateAgent(input as AgentCreateInput);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    const matchesSpecialization = filterSpecialization === 'all' || 
      (agent.specializations && agent.specializations.includes(filterSpecialization));
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.licenseNumber && agent.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSpecialization && matchesSearch;
  });

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Agents</h1>
        <button
          onClick={() => {
            setSelectedAgent(undefined);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Agent
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as AgentStatus | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={filterSpecialization}
          onChange={(e) => setFilterSpecialization(e.target.value as AgentSpecialization | 'all')}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              {agent.profileImage ? (
                <Image
                  src={agent.profileImage}
                  alt={agent.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <UserCircleIcon className="h-20 w-20 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <select
                  value={agent.status || 'Active'}
                  onChange={(e) => handleUpdateStatus(agent.id, e.target.value as AgentStatus)}
                  className="text-sm bg-white border border-gray-300 rounded-md shadow-sm px-2 py-1"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  <p className="text-gray-600">{agent.title || 'Real Estate Agent'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedAgent(agent);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{agent.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{agent.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">RERA: {agent.licenseNumber || 'N/A'}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {agent.specializations && agent.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Properties</p>
                  <p className="font-medium">{agent.properties?.length || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="font-medium">{agent.experience || 0} years</p>
                </div>
                <div>
                  <p className="text-gray-500">Rating</p>
                  <p className="font-medium">{agent.rating || 0}/5</p>
                </div>
                <div>
                  <p className="text-gray-500">Reviews</p>
                  <p className="font-medium">{agent.reviews || 0}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Agent Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {selectedAgent ? 'Edit Agent' : 'Add New Agent'}
                </Dialog.Title>
                <AgentForm
                  agent={selectedAgent}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsModalOpen(false)}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 