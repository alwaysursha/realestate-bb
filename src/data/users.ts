import { User } from '@/types/user';

export const initialUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "teamalisyed@gmail.com",
    role: "Admin",
    status: "Active",
    permissions: ["all"],
    createdAt: new Date("2023-01-01"),
    lastLogin: new Date()
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Agent",
    status: "Active",
    permissions: ["view_properties", "edit_properties", "view_clients"],
    createdAt: new Date("2023-02-15"),
    lastLogin: new Date("2023-07-20")
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Agent",
    status: "Active",
    permissions: ["view_properties", "edit_properties", "view_clients"],
    createdAt: new Date("2023-03-10"),
    lastLogin: new Date("2023-07-15")
  },
  {
    id: '4',
    name: 'Mohammed Al-Rashid',
    email: 'mohammed.rashid@builderbookings.com',
    role: 'Agent',
    status: 'Active',
    avatar: '/images/avatars/agent-2.jpg',
    createdAt: new Date('2023-02-01'),
    lastLogin: new Date('2024-03-06'),
    permissions: ['view_properties', 'edit_properties']
  },
  {
    id: '5',
    name: 'Emily Chen',
    email: 'emily.chen@builderbookings.com',
    role: 'Agent',
    status: 'Active',
    avatar: '/images/avatars/agent-3.jpg',
    createdAt: new Date('2023-03-01'),
    lastLogin: new Date('2024-03-07'),
    permissions: ['view_properties', 'edit_properties']
  },
  {
    id: '6',
    name: 'David Wilson',
    email: 'david.wilson@builderbookings.com',
    role: 'User',
    status: 'Active',
    avatar: '/images/avatars/viewer-1.jpg',
    createdAt: new Date('2023-05-01'),
    lastLogin: new Date('2024-03-04'),
    permissions: ['view_properties']
  }
]; 