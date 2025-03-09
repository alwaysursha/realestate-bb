import { useState } from 'react';
import { Property } from '@/types/property';
import { inquiryService } from '@/services/inquiryService';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-hot-toast';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaTimes } from 'react-icons/fa';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export default function InquiryModal({ isOpen, onClose, property }: InquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await inquiryService.createInquiry({
        propertyId: property.id ? property.id.toString() : '',
        propertySnapshot: {
          id: property.id ? property.id.toString() : '',
          title: property.title,
          location: property.location,
          price: property.price,
          mainImage: property.image || property.images[0] || '',
        },
        ...formData
      });

      toast.success('Inquiry sent successfully!');
      onClose();
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const propertyImage = property.image || property.images[0] || '';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Brand Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 px-6 text-white relative">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-3 text-white/80 hover:text-white transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-3">
                      <FaHome size={24} />
                      <div className="flex flex-col items-start">
                        <h2 className="text-xl font-extrabold tracking-wide">BuilderBookings</h2>
                        <p className="text-sm font-semibold text-yellow-300">Inquiry Form</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Preview */}
                <div className="py-3 px-6 bg-gradient-to-b from-gray-50 to-white border-b">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden group">
                      <img
                        src={propertyImage}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1 truncate">{property.title}</h4>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FaMapMarkerAlt size={14} color="#3B82F6" />
                        <span className="ml-1 truncate">{property.location}</span>
                      </div>
                      <div className="flex items-center text-sm font-medium text-blue-600">
                        <FaDollarSign size={14} />
                        <span className="ml-1">{property.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inquiry Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-left"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-left"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-left">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-left"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 text-left">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-left"
                      placeholder="Tell us what you're interested in..."
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Inquiry'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 