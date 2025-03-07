import { User, UserCreateInput, UserUpdateInput, UserRole, UserStatus, ROLE_PERMISSIONS } from '@/types/user';

class UserService {
  private users: User[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@builderbookings.com',
      role: 'Super Admin',
      status: 'Active',
      createdAt: new Date(),
      permissions: ROLE_PERMISSIONS['Super Admin'],
    }
  ];

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(input: UserCreateInput): Promise<User> {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...input,
      createdAt: new Date(),
      permissions: ROLE_PERMISSIONS[input.role],
      status: input.status || 'Active',
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, input: UserUpdateInput): Promise<User | null> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;

    const updatedUser = {
      ...this.users[index],
      ...input,
      permissions: input.role ? ROLE_PERMISSIONS[input.role] : this.users[index].permissions,
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.users.filter(user => user.role === role);
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
}

export const userService = new UserService(); 