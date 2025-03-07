'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Property } from '@/types/property';
import * as propertiesService from '@/services/propertiesService';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [newProperty, setNewProperty] = useState<Omit<Property, 'id'>>({
    title: '',
    location: '',
    city: 'Dubai',
    price: 0,
    beds: 0,
    baths: 0,
    area: 0,
    type: '',
    status: '',
    developer: '',
    description: '',
    images: [],
    image: '',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    category: 'Apartment',
    isFeatured: false,
    createdAt: new Date(),
    agent: {
      name: '',
      role: '',
      phone: '',
      email: '',
      image: ''
    }
  });
  
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  // Load properties from service
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        // Clear and reinitialize properties to ensure we have all data
        await propertiesService.clearAndReinitializeProperties();
        const data = await propertiesService.getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      loadProperties();
    }
  }, [isAuthenticated]);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Property types for filter
  const propertyTypes = ['All', 'Apartment', 'Villa', 'Townhouse', 'Penthouse'];
  
  // Property statuses for filter
  const propertyStatuses = ['All', 'Now Selling', 'Coming Soon', 'Sold Out'];

  // Filter and sort properties
  const filteredProperties = properties
    .filter((property) => {
      // Search filter
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = filterType === 'All' || property.type === filterType;
      
      // Status filter
      const matchesStatus = filterStatus === 'All' || property.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      // Sort properties
      if (sortBy === 'newest') {
        return (b.id as number) - (a.id as number);
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      } else if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      return 0;
    });

  // Handle adding a new property
  const handleAddProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const propertyToAdd = {
        ...newProperty,
        title: formData.get('title') as string,
        location: formData.get('location') as string,
        city: formData.get('city') as Property['city'],
        price: Number(formData.get('price')),
        type: formData.get('type') as string,
        beds: Number(formData.get('beds')),
        baths: Number(formData.get('baths')),
        area: Number(formData.get('area')),
        status: formData.get('status') as string,
        developer: formData.get('developer') as string,
        category: formData.get('category') as Property['category'],
        isFeatured: formData.get('isFeatured') === 'on',
        description: formData.get('description') as string,
        features: (formData.get('features') as string).split(',').map(f => f.trim()),
        images: (formData.get('images') as string).split(',').map(img => img.trim()),
        agent: {
          name: formData.get('agentName') as string,
          role: formData.get('agentRole') as string,
          phone: formData.get('agentPhone') as string,
          email: formData.get('agentEmail') as string,
          image: formData.get('agentImage') as string
        }
      };
      
      const addedProperty = await propertiesService.addProperty(propertyToAdd);
      setProperties([...properties, addedProperty]);
      setIsAddModalOpen(false);
      
      // Reset form
      setNewProperty({
        title: '',
        location: '',
        city: 'Dubai',
        price: 0,
        beds: 0,
        baths: 0,
        area: 0,
        type: '',
        status: '',
        developer: '',
        description: '',
        images: [],
        image: '',
        coordinates: { lat: 25.2048, lng: 55.2708 },
        category: 'Apartment',
        isFeatured: false,
        createdAt: new Date(),
        agent: {
          name: '',
          role: '',
          phone: '',
          email: '',
          image: ''
        }
      });
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Failed to add property. Please try again.');
    }
  };

  // Handle editing a property
  const handleEditProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentProperty) return;
    
    try {
      const formData = new FormData(e.currentTarget);
      const propertyToUpdate = {
        ...currentProperty,
        title: formData.get('title') as string,
        location: formData.get('location') as string,
        city: formData.get('city') as Property['city'],
        price: Number(formData.get('price')),
        type: formData.get('type') as string,
        beds: Number(formData.get('beds')),
        baths: Number(formData.get('baths')),
        area: Number(formData.get('area')),
        status: formData.get('status') as string,
        developer: formData.get('developer') as string,
        category: formData.get('category') as Property['category'],
        isFeatured: formData.get('isFeatured') === 'on',
        description: formData.get('description') as string,
        features: (formData.get('features') as string).split(',').map(f => f.trim()),
        images: (formData.get('images') as string).split(',').map(img => img.trim()),
        agent: {
          name: formData.get('agentName') as string,
          role: formData.get('agentRole') as string,
          phone: formData.get('agentPhone') as string,
          email: formData.get('agentEmail') as string,
          image: formData.get('agentImage') as string
        }
      };
      
      const updatedProperty = await propertiesService.updateProperty(currentProperty.id, propertyToUpdate);
      
      if (updatedProperty) {
        const updatedProperties = properties.map(property => 
          property.id === currentProperty.id ? updatedProperty : property
        );
        
        setProperties(updatedProperties);
      }
      
      setIsEditModalOpen(false);
      setCurrentProperty(null);
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property. Please try again.');
    }
  };

  // Handle deleting a property
  const handleDeleteProperty = async (id: number | string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        const success = await propertiesService.deleteProperty(id);
        
        if (success) {
          setProperties(properties.filter(property => property.id !== id));
        } else {
          alert('Property not found.');
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  // If still loading authentication state, show loading spinner
  if (authLoading || isLoading) {
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

  return (
    <div className="space-y-6">
      {/* Page title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <div className="mt-3 sm:mt-0">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Property
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Property Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              id="type"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {propertyStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              id="sort"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img
                          className="w-10 h-10 rounded-md object-cover"
                          src={property.image || '/images/property-placeholder.jpg'}
                          alt={property.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-sm text-gray-500">ID: {property.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">AED {property.price.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      property.status === 'Now Selling' ? 'bg-green-100 text-green-800' :
                      property.status === 'Coming Soon' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      property.isFeatured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.isFeatured ? 'Featured' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => {
                          setCurrentProperty(property);
                          setIsEditModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProperties.length}</span> of{' '}
              <span className="font-medium">{filteredProperties.length}</span> results
            </p>
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Property</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
              <form onSubmit={handleAddProperty}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="text" name="location" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <select name="city" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="Dubai">Dubai</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                      <option value="RAK">RAK</option>
                      <option value="UAQ">UAQ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input type="number" name="price" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select name="type" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Beds</label>
                    <input type="number" name="beds" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Baths</label>
                    <input type="number" name="baths" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Area (sq ft)</label>
                    <input type="number" name="area" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="Now Selling">Now Selling</option>
                      <option value="Coming Soon">Coming Soon</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Developer</label>
                    <input type="text" name="developer" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="Villa">Villa</option>
                      <option value="Semi">Semi</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Featured Property
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
                  <input type="text" name="features" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Images (comma-separated URLs)</label>
                  <input type="text" name="images" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Agent Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" name="agentName" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <input type="text" name="agentRole" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input type="text" name="agentPhone" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" name="agentEmail" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Image URL</label>
                      <input type="text" name="agentImage" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {isEditModalOpen && currentProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Property</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setCurrentProperty(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
              <form onSubmit={handleEditProperty}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" defaultValue={currentProperty.title} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="text" name="location" defaultValue={currentProperty.location} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <select name="city" defaultValue={currentProperty.city} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="Dubai">Dubai</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                      <option value="RAK">RAK</option>
                      <option value="UAQ">UAQ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input type="number" name="price" defaultValue={currentProperty.price} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select name="type" defaultValue={currentProperty.type} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Beds</label>
                    <input type="number" name="beds" defaultValue={currentProperty.beds} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Baths</label>
                    <input type="number" name="baths" defaultValue={currentProperty.baths} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Area (sq ft)</label>
                    <input type="number" name="area" defaultValue={currentProperty.area} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" defaultValue={currentProperty.status} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="Now Selling">Now Selling</option>
                      <option value="Coming Soon">Coming Soon</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Developer</label>
                    <input type="text" name="developer" defaultValue={currentProperty.developer} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" defaultValue={currentProperty.category} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="Villa">Villa</option>
                      <option value="Semi">Semi</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      defaultChecked={currentProperty.isFeatured}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Featured Property
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" defaultValue={currentProperty.description} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
                  <input type="text" name="features" defaultValue={currentProperty.features?.join(', ')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Images (comma-separated URLs)</label>
                  <input type="text" name="images" defaultValue={currentProperty.images.join(', ')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Agent Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" name="agentName" defaultValue={currentProperty.agent?.name} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <input type="text" name="agentRole" defaultValue={currentProperty.agent?.role} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input type="text" name="agentPhone" defaultValue={currentProperty.agent?.phone} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" name="agentEmail" defaultValue={currentProperty.agent?.email} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Image URL</label>
                      <input type="text" name="agentImage" defaultValue={currentProperty.agent?.image} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setCurrentProperty(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 