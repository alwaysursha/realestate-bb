export type UserRole = 'Super Admin' | 'Admin' | 'Agent' | 'Editor' | 'Viewer';

export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  permissions: string[];
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  password?: string;
}

export const USER_PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_PROPERTIES: 'manage_properties',
  VIEW_PROPERTIES: 'view_properties',
  EDIT_PROPERTIES: 'edit_properties',
  MANAGE_SETTINGS: 'manage_settings',
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'Super Admin': Object.values(USER_PERMISSIONS),
  'Admin': [
    USER_PERMISSIONS.MANAGE_USERS,
    USER_PERMISSIONS.MANAGE_PROPERTIES,
    USER_PERMISSIONS.VIEW_PROPERTIES,
    USER_PERMISSIONS.EDIT_PROPERTIES,
  ],
  'Agent': [
    USER_PERMISSIONS.VIEW_PROPERTIES,
    USER_PERMISSIONS.EDIT_PROPERTIES,
  ],
  'Editor': [
    USER_PERMISSIONS.VIEW_PROPERTIES,
    USER_PERMISSIONS.EDIT_PROPERTIES,
  ],
  'Viewer': [
    USER_PERMISSIONS.VIEW_PROPERTIES,
  ],
}; 