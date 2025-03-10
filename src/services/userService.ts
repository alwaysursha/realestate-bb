import { User, UserCreateInput, UserUpdateInput, UserRole, UserStatus, ROLE_PERMISSIONS } from '@/types/user';
import { initialUsers } from '@/data/users';

const USERS_STORAGE_KEY = 'real_estate_users';

class UserService {
  private getUsersFromStorage(): User[] {
    if (typeof window === 'undefined') {
      // Return initial users during server-side rendering
      return initialUsers.map(user => ({
        ...user,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        lastLogin: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
      }));
    }
    
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      this.saveUsersToStorage(initialUsers);
      return initialUsers;
    }
    
    return JSON.parse(stored, (key, value) => {
      if (key === 'createdAt' || key === 'lastLogin') return new Date(value);
      return value;
    });
  }

  private saveUsersToStorage(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  async getUsers(): Promise<User[]> {
    return this.getUsersFromStorage();
  }

  async getUserById(id: string): Promise<User | null> {
    const users = this.getUsersFromStorage();
    return users.find(user => user.id === id) || null;
  }

  async createUser(input: UserCreateInput): Promise<User> {
    const users = this.getUsersFromStorage();
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...input,
      createdAt: new Date(),
      lastLogin: new Date(),
      permissions: ROLE_PERMISSIONS[input.role],
      status: input.status || 'Active',
    };
    
    users.push(newUser);
    this.saveUsersToStorage(users);
    return newUser;
  }

  async updateUser(id: string, input: UserUpdateInput): Promise<User | null> {
    const users = this.getUsersFromStorage();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;

    const updatedUser = {
      ...users[index],
      ...input,
      permissions: input.role ? ROLE_PERMISSIONS[input.role] : users[index].permissions,
    };

    users[index] = updatedUser;
    this.saveUsersToStorage(users);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = this.getUsersFromStorage();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    this.saveUsersToStorage(users);
    return true;
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    const users = this.getUsersFromStorage();
    return users.filter(user => user.role === role);
  }

  async updateUserStatus(id: string, status: UserStatus): Promise<User | null> {
    return this.updateUser(id, { status });
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    return user?.permissions.includes(permission) || false;
  }

  async getUserStats(): Promise<{ total: number; monthlyChange: number; isPositive: boolean }> {
    const allUsers = await this.getUsers();
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Count active users this month
    const currentActiveUsers = allUsers.filter(
      user => user.status === 'Active'
    ).length;

    // Count active users last month (excluding users created this month)
    const lastMonthUsers = allUsers.filter(
      user => user.createdAt < lastMonth
    );
    const lastMonthActiveUsers = lastMonthUsers.filter(
      user => user.status === 'Active'
    ).length;

    // Calculate percentage change
    const change = lastMonthActiveUsers === 0
      ? 100 // If there were no active users last month, treat as 100% increase
      : ((currentActiveUsers / lastMonthActiveUsers) - 1) * 100;

    return {
      total: currentActiveUsers,
      monthlyChange: Math.abs(Math.round(change)),
      isPositive: change >= 0
    };
  }

  // Initialize or reset users data
  async resetUsers(): Promise<User[]> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USERS_STORAGE_KEY);
    }
    return this.getUsersFromStorage();
  }
}

export const userService = new UserService(); 