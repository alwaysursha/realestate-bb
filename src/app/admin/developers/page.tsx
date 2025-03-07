'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminCard from '@/components/admin/AdminCard';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Developer } from '@/data/developers';
import * as developersService from '@/services/developersService';

export default function DevelopersAdmin() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDeveloper, setCurrentDeveloper] = useState<Developer | null>(null);
  const [newDeveloper, setNewDeveloper] = useState<Omit<Developer, 'id'>>({
    name: '',
    logo: '',
    description: '',
    projectCount: 0,
    establishedYear: new Date().getFullYear(),
    slug: '',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  // Load developers from service
  useEffect(() => {
    const loadDevelopers = async () => {
      try {
        setIsLoading(true);
        const data = await developersService.getAllDevelopers();
        setDevelopers(data);
      } catch (error) {
        console.error('Error loading developers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      loadDevelopers();
    }
  }, [isAuthenticated]);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login/');
    }
  }, [isAuthenticated, authLoading, router]);

  // If still loading authentication state, show loading spinner
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, don't render the page content
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Filter developers based on search term
  const filteredDevelopers = developers.filter(developer =>
    developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    developer.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new developer
  const handleAddDeveloper = async () => {
    try {
      // Create slug from name if not provided
      const slug = newDeveloper.slug || newDeveloper.name.toLowerCase().replace(/\s+/g, '-');
      
      const developerToAdd = {
        ...newDeveloper,
        slug,
        projectCount: Number(newDeveloper.projectCount),
        establishedYear: Number(newDeveloper.establishedYear)
      };
      
      const addedDeveloper = await developersService.addDeveloper(developerToAdd);
      setDevelopers([...developers, addedDeveloper]);
      
      setNewDeveloper({
        name: '',
        logo: '',
        description: '',
        projectCount: 0,
        establishedYear: new Date().getFullYear(),
        slug: '',
        status: 'active'
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding developer:', error);
      alert('Failed to add developer. Please try again.');
    }
  };

  // Handle editing a developer
  const handleEditDeveloper = async () => {
    if (!currentDeveloper) return;
    
    try {
      const updatedDeveloper = await developersService.updateDeveloper(
        currentDeveloper.id, 
        {
          ...currentDeveloper,
          projectCount: Number(currentDeveloper.projectCount),
          establishedYear: Number(currentDeveloper.establishedYear)
        }
      );
      
      if (updatedDeveloper) {
        const updatedDevelopers = developers.map(developer => 
          developer.id === currentDeveloper.id ? updatedDeveloper : developer
        );
        
        setDevelopers(updatedDevelopers);
      }
      
      setIsEditModalOpen(false);
      setCurrentDeveloper(null);
    } catch (error) {
      console.error('Error updating developer:', error);
      alert('Failed to update developer. Please try again.');
    }
  };

  // Handle deleting a developer
  const handleDeleteDeveloper = async (id: string) => {
    if (confirm('Are you sure you want to delete this developer?')) {
      try {
        const success = await developersService.deleteDeveloper(id);
        
        if (success) {
          setDevelopers(developers.filter(developer => developer.id !== id));
        } else {
          alert('Developer not found.');
        }
      } catch (error) {
        console.error('Error deleting developer:', error);
        alert('Failed to delete developer. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Developers Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Developer
        </button>
      </div>

      <AdminCard>
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search developers..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Developer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Established
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDevelopers.map((developer) => (
                  <tr key={developer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-4 bg-gray-100 rounded-md overflow-hidden">
                          {developer.logo ? (
                            <Image
                              src={developer.logo}
                              alt={developer.name}
                              width={40}
                              height={40}
                              className="object-contain"
                              unoptimized={true}
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-gray-500">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{developer.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{developer.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {developer.projectCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {developer.establishedYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        developer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {developer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setCurrentDeveloper(developer);
                          setIsEditModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDeveloper(developer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredDevelopers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No developers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminCard>

      {/* Add Developer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Developer</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeveloper.name}
                  onChange={(e) => setNewDeveloper({...newDeveloper, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeveloper.logo}
                  onChange={(e) => setNewDeveloper({...newDeveloper, logo: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  value={newDeveloper.description}
                  onChange={(e) => setNewDeveloper({...newDeveloper, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Count</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newDeveloper.projectCount}
                    onChange={(e) => setNewDeveloper({...newDeveloper, projectCount: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newDeveloper.establishedYear}
                    onChange={(e) => setNewDeveloper({...newDeveloper, establishedYear: parseInt(e.target.value) || new Date().getFullYear()})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL-friendly name)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeveloper.slug}
                  onChange={(e) => setNewDeveloper({...newDeveloper, slug: e.target.value})}
                  placeholder="auto-generated if left empty"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeveloper.status}
                  onChange={(e) => setNewDeveloper({
                    ...newDeveloper, 
                    status: e.target.value === 'active' ? 'active' : 'inactive'
                  })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDeveloper}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!newDeveloper.name}
              >
                Add Developer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Developer Modal */}
      {isEditModalOpen && currentDeveloper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Developer</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentDeveloper.name}
                  onChange={(e) => setCurrentDeveloper({...currentDeveloper, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentDeveloper.logo}
                  onChange={(e) => setCurrentDeveloper({...currentDeveloper, logo: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  value={currentDeveloper.description}
                  onChange={(e) => setCurrentDeveloper({...currentDeveloper, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Count</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={currentDeveloper.projectCount}
                    onChange={(e) => setCurrentDeveloper({...currentDeveloper, projectCount: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={currentDeveloper.establishedYear}
                    onChange={(e) => setCurrentDeveloper({...currentDeveloper, establishedYear: parseInt(e.target.value) || new Date().getFullYear()})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL-friendly name)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentDeveloper.slug}
                  onChange={(e) => setCurrentDeveloper({...currentDeveloper, slug: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentDeveloper.status}
                  onChange={(e) => setCurrentDeveloper({
                    ...currentDeveloper, 
                    status: e.target.value === 'active' ? 'active' : 'inactive'
                  })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setCurrentDeveloper(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditDeveloper}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!currentDeveloper.name}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 