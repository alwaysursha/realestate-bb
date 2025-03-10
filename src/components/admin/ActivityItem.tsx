'use client';

import React from 'react';

interface ActivityItemProps {
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  iconColor?: string;
}

export default function ActivityItem({ 
  user, 
  action, 
  target, 
  timestamp, 
  iconColor = 'bg-blue-500' 
}: ActivityItemProps) {
  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        {user.avatar ? (
          <img
            className="h-8 w-8 rounded-full"
            src={user.avatar}
            alt={user.name}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">
              {user.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-900">{user.name}</span> {action}{' '}
          <span className="font-medium text-gray-900">{target}</span>
        </div>
        <div className="mt-1 text-sm text-gray-500">
          <span>{timestamp}</span>
        </div>
      </div>
      <div className="flex-shrink-0 self-center">
        <div className={`h-2 w-2 rounded-full ${iconColor}`}></div>
      </div>
    </div>
  );
} 