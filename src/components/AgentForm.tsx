import { useState } from 'react';
import { Agent, AgentCreateInput, AgentSpecialization, AgentLanguage } from '@/types/agent';
import ImageUpload from './ImageUpload';

interface AgentFormProps {
  agent?: Agent;
  onSubmit: (data: AgentCreateInput) => Promise<void>;
  onCancel: () => void;
}

export default function AgentForm({ agent, onSubmit, onCancel }: AgentFormProps) {
  const [formData, setFormData] = useState<AgentCreateInput>({
    userId: agent?.userId || '',
    name: agent?.name || '',
    title: agent?.title || '',
    email: agent?.email || '',
    phone: agent?.phone || '',
    photo: agent?.photo || '',
    licenseNumber: agent?.licenseNumber || '',
    licenseExpiry: agent?.licenseExpiry || new Date(),
    specializations: agent?.specializations || [],
    languages: agent?.languages || [],
    experience: agent?.experience || 0,
    bio: agent?.bio || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AgentCreateInput, string>>>({});

  const specializations: AgentSpecialization[] = [
    'Luxury',
    'Commercial',
    'Residential',
    'Off-Plan',
    'International'
  ];

  const languages: AgentLanguage[] = [
    'English',
    'Arabic',
    'Hindi',
    'Urdu',
    'French',
    'Chinese',
    'Russian'
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (errors[name as keyof AgentCreateInput]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSpecializationChange = (specialization: AgentSpecialization) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleLanguageChange = (language: AgentLanguage) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AgentCreateInput, string>> = {};

    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
    if (!formData.licenseExpiry) newErrors.licenseExpiry = 'License expiry date is required';
    if (formData.specializations.length === 0) newErrors.specializations = 'At least one specialization is required';
    if (formData.languages.length === 0) newErrors.languages = 'At least one language is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.bio) newErrors.bio = 'Bio is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      photo: url
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo
        </label>
        <ImageUpload
          currentImage={formData.photo}
          onImageUpload={handleImageUpload}
          className="mb-4"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* User ID */}
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
            User ID
          </label>
          <input
            type="text"
            name="userId"
            id="userId"
            value={formData.userId}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.userId ? 'border-red-500' : ''
            }`}
          />
          {errors.userId && <p className="mt-1 text-sm text-red-500">{errors.userId}</p>}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.phone ? 'border-red-500' : ''
            }`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>

        {/* License Number */}
        <div>
          <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
            License Number
          </label>
          <input
            type="text"
            name="licenseNumber"
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.licenseNumber ? 'border-red-500' : ''
            }`}
          />
          {errors.licenseNumber && <p className="mt-1 text-sm text-red-500">{errors.licenseNumber}</p>}
        </div>

        {/* License Expiry */}
        <div>
          <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700">
            License Expiry
          </label>
          <input
            type="date"
            name="licenseExpiry"
            id="licenseExpiry"
            value={formData.licenseExpiry.toISOString().split('T')[0]}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              licenseExpiry: new Date(e.target.value)
            }))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.licenseExpiry ? 'border-red-500' : ''
            }`}
          />
          {errors.licenseExpiry && <p className="mt-1 text-sm text-red-500">{errors.licenseExpiry}</p>}
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Experience (years)
          </label>
          <input
            type="number"
            name="experience"
            id="experience"
            min="0"
            value={formData.experience}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.experience ? 'border-red-500' : ''
            }`}
          />
          {errors.experience && <p className="mt-1 text-sm text-red-500">{errors.experience}</p>}
        </div>
      </div>

      {/* Specializations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specializations
        </label>
        <div className="flex flex-wrap gap-2">
          {specializations.map(specialization => (
            <button
              key={specialization}
              type="button"
              onClick={() => handleSpecializationChange(specialization)}
              className={`px-3 py-1 rounded-full text-sm ${
                formData.specializations.includes(specialization)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {specialization}
            </button>
          ))}
        </div>
        {errors.specializations && (
          <p className="mt-1 text-sm text-red-500">{errors.specializations}</p>
        )}
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages
        </label>
        <div className="flex flex-wrap gap-2">
          {languages.map(language => (
            <button
              key={language}
              type="button"
              onClick={() => handleLanguageChange(language)}
              className={`px-3 py-1 rounded-full text-sm ${
                formData.languages.includes(language)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
        {errors.languages && (
          <p className="mt-1 text-sm text-red-500">{errors.languages}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          name="bio"
          id="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.bio ? 'border-red-500' : ''
          }`}
        />
        {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          {agent ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
} 