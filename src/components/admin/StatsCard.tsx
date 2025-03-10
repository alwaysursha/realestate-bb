import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  colorClass: string;
  onClick: () => void;
  error?: string | null;
}

export default function StatsCard({
  title,
  value,
  icon,
  change,
  colorClass,
  onClick,
  error
}: StatsCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      {error ? (
        <div className="p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-md ${colorClass}`}>
              {icon}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd className="text-red-600 text-sm">{error}</dd>
              </dl>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-md ${colorClass}`}>
              {icon}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </div>
                  {change && (
                    <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0 ${
                      change.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <span className="sr-only">
                        {change.isPositive ? 'Increased by' : 'Decreased by'}
                      </span>
                      {change.isPositive ? '↑' : '↓'}
                      {typeof change.value === 'number' ? change.value.toLocaleString() : change.value}%
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 