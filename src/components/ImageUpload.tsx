import { useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (url: string) => void;
  className?: string;
}

export default function ImageUpload({ currentImage, onImageUpload, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpload(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setPreviewUrl(currentImage); // Reset preview on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={handleClick}
        className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer group"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Agent photo"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <UserCircleIcon className="h-24 w-24 text-gray-400" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {isUploading ? 'Uploading...' : 'Change Photo'}
          </span>
        </div>

        {/* Loading Spinner */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
} 