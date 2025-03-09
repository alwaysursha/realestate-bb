import { Property } from '@/types/property';
import { useState, useRef, useEffect } from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaWhatsapp, 
  FaLinkedin, 
  FaTelegram, 
  FaEnvelope 
} from 'react-icons/fa';

interface ShareMenuProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareMenu({ property, isOpen, onClose }: ShareMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const propertyUrl = typeof window !== 'undefined' ? `${window.location.origin}/property/${property.id}` : '';
  const shareText = `Check out this property: ${property.title} in ${property.location}`;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebook className="w-4 h-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
      color: 'bg-[#1877f2] hover:bg-[#1865d3]'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter className="w-4 h-4" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-[#1da1f2] hover:bg-[#1a91da]'
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="w-4 h-4" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + propertyUrl)}`,
      color: 'bg-[#25d366] hover:bg-[#22bf5b]'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="w-4 h-4" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(propertyUrl)}&title=${encodeURIComponent(shareText)}`,
      color: 'bg-[#0077b5] hover:bg-[#006399]'
    },
    {
      name: 'Telegram',
      icon: <FaTelegram className="w-4 h-4" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-[#0088cc] hover:bg-[#0077b3]'
    },
    {
      name: 'Email',
      icon: <FaEnvelope className="w-4 h-4" />,
      url: `mailto:?subject=${encodeURIComponent(`Property Listing: ${property.title}`)}&body=${encodeURIComponent(shareText + '\n\n' + propertyUrl)}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div 
      ref={menuRef}
      className="absolute bottom-full right-0 mb-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-3 w-[220px] z-50 animate-fade-in"
      style={{
        animation: 'fadeIn 0.2s ease-out, slideUp 0.2s ease-out',
      }}
    >
      <div className="text-xs font-medium text-gray-500 mb-2 px-1">Share via</div>
      <div className="grid grid-cols-3 gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (link.name !== 'Email') {
                window.open(link.url, '_blank', 'width=600,height=400');
              } else {
                window.location.href = link.url;
              }
              onClose();
            }}
            className={`${link.color} text-white p-2 rounded-lg flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 group`}
            title={link.name}
          >
            {link.icon}
            <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4">{link.name}</span>
          </a>
        ))}
      </div>
      <div className="absolute top-full right-4 transform -translate-y-1/2">
        <div className="border-[6px] border-transparent border-t-white/95 filter drop-shadow-sm"></div>
      </div>
    </div>
  );
} 