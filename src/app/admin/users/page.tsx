'use client';

import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { User, UserCreateInput, UserUpdateInput, UserRole, UserStatus } from '@/types/user';
import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image';
import { 
  UserCircleIcon, 
  EnvelopeIcon,
  PencilIcon,
  XMarkIcon,
  PlusIcon,
  KeyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import UserForm from '@/components/UserForm';
import { userService } from '@/services/userService';

export default function AdminUsers() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleCreateUser = async (input: UserCreateInput) => {
    try {
      const newUser = await userService.createUser(input);
      setUsers(prev => [...prev, newUser]);
      toast.success('User created successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (id: string, input: UserUpdateInput) => {
    try {
      const updatedUser = await userService.updateUser(id, input);
      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.id === id ? updatedUser : user
        ));
        toast.success('User updated successfully');
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleUpdateStatus = async (userId: string, status: UserStatus) => {
    try {
      const updatedUser = await userService.updateUserStatus(userId, status);
      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? updatedUser : user
        ));
        toast.success('Status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const success = await userService.deleteUser(userId);
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleFormSubmit = async (input: UserCreateInput | UserUpdateInput) => {
    if (selectedUser) {
      await handleUpdateUser(selectedUser.id, input as UserUpdateInput);
    } else {
      await handleCreateUser(input as UserCreateInput);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <button
          onClick={() => {
            setSelectedUser(undefined);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Agent">Agent</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as UserStatus | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <UserCircleIcon className="h-20 w-20 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <select
                  value={user.status}
                  onChange={(e) => handleUpdateStatus(user.id, e.target.value as UserStatus)}
                  className="text-sm bg-white border border-gray-300 rounded-md shadow-sm px-2 py-1"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{user.role}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <KeyIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{user.permissions.length} Permissions</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {user.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                <div>
                  <div className="text-sm font-semibold">
                    {user.createdAt instanceof Date 
                      ? user.createdAt.toLocaleDateString()
                      : new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">Created</div>
                </div>
                <div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">
                      {user.lastLogin instanceof Date 
                        ? user.lastLogin.toLocaleDateString()
                        : user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString() 
                          : 'Never'}
                    </div>
                    <div className="text-xs text-gray-500">Last Login</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit User Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {selectedUser ? 'Edit User' : 'Add New User'}
                </Dialog.Title>
                <UserForm
                  user={selectedUser}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsModalOpen(false)}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 