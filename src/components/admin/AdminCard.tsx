import React, { ReactNode } from 'react';

interface AdminCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  footer?: ReactNode;
}

export const AdminCard: React.FC<AdminCardProps> = ({ 
  children, 
  title, 
  className = '',
  footer
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default AdminCard; 