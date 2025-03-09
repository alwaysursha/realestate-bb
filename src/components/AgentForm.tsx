'use client';

import { useState, useEffect } from 'react';
import { Agent, AgentCreateInput, AgentUpdateInput, AgentSpecialization, AgentLanguage } from '@/types/agent';
import { userService } from '@/services/userService';
import ImageUpload from './ImageUpload';

interface AgentFormProps {
  agent?: Agent;
  onSubmit: (data: AgentCreateInput | AgentUpdateInput) => Promise<void>;
  onCancel: () => void;
}

interface FormData extends Omit<AgentCreateInput, 'licenseExpiry'> {
  licenseExpiry: string;
}

export default function AgentForm({ agent, onSubmit, onCancel }: AgentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    title: '',
    email: '',
    phone: '',
    photo: '',
    licenseNumber: '',
    licenseExpiry: '',
    specializations: [],
    languages: [],
    experience: 0,
    bio: '',
    userId: ''
  });
  const [availableUsers, setAvailableUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        title: agent.title || '',
        email: agent.email,
        phone: agent.phone,
        photo: agent.profileImage || '',
        licenseNumber: agent.licenseNumber || '',
        licenseExpiry: agent.licenseExpiry ? agent.licenseExpiry.toISOString().split('T')[0] : '',
        specializations: (agent.specializations || []) as AgentSpecialization[],
        languages: (agent.languages || []) as AgentLanguage[],
        experience: agent.experience || 0,
        bio: agent.bio,
        userId: agent.userId || ''
      });
    }
    fetchAvailableUsers();
  }, [agent]);

  const fetchAvailableUsers = async () => {
    try {
      const users = await userService.getUsersByRole('Agent');
      setAvailableUsers(users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email
      })));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const values = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        licenseExpiry: new Date(formData.licenseExpiry)
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
    setLoading(false);
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      photo: url
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!agent && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select User
          </label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a user</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photo URL
          </label>
          <input
            type="text"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Number
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Expiry
          </label>
          <input
            type="date"
            name="licenseExpiry"
            value={formData.licenseExpiry}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Experience (years)
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Specializations
          </label>
          <select
            name="specializations"
            value={formData.specializations}
            onChange={handleMultiSelect}
            multiple
            required
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Luxury">Luxury</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
            <option value="Off-Plan">Off-Plan</option>
            <option value="International">International</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Languages
          </label>
          <select
            name="languages"
            value={formData.languages}
            onChange={handleMultiSelect}
            multiple
            required
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="Chinese">Chinese</option>
            <option value="French">French</option>
            <option value="Hindi">Hindi</option>
            <option value="Russian">Russian</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : agent ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
} 