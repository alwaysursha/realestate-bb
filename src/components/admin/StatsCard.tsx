import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  colorClass?: string;
  onClick?: () => void;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  colorClass = 'bg-blue-500',
  onClick
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClass}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div 
                  className={`text-lg font-medium text-gray-900 ${onClick ? 'cursor-pointer hover:text-blue-600' : ''}`}
                  onClick={onClick}
                >
                  {value}
                </div>
              </dd>
              {change && (
                <dd className="flex items-center text-sm mt-1">
                  <span className={`flex items-center ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {change.isPositive ? (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                    {change.value}%
                  </span>
                  <span className="text-gray-500 ml-2">from last month</span>
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 