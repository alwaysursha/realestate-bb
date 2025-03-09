export type UserRole = 'Admin' | 'Agent' | 'User' | 'Editor';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  permissions: string[];
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserCreateInput {
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  avatar?: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'Admin': ['all'],
  'Agent': ['view_properties', 'edit_properties', 'view_clients'],
  'User': ['view_properties'],
  'Editor': ['view_properties', 'edit_properties']
}; 