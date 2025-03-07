export type AgentSpecialization = 'Luxury' | 'Commercial' | 'Residential' | 'Off-Plan' | 'International';

export type AgentLanguage = 'English' | 'Arabic' | 'Hindi' | 'Urdu' | 'French' | 'Chinese' | 'Russian';

export type AgentStatus = 'Active' | 'On Leave' | 'Inactive';

export interface AgentCertification {
  name: string;
  issuer: string;
  dateObtained: Date;
  expiryDate?: Date;
  verificationId?: string;
}

export interface AgentPerformance {
  totalListings: number;
  activeListings: number;
  soldProperties: number;
  totalSalesValue: number;
  averageRating: number;
  responseTime: number; // in hours
  successRate: number; // percentage
  monthlyStats: {
    month: string;
    salesCount: number;
    salesValue: number;
    newListings: number;
  }[];
}

export interface AgentSocialMedia {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

export interface AgentPortfolio {
  featuredListings: string[]; // Property IDs
  pastTransactions: {
    propertyId: string;
    transactionDate: Date;
    transactionType: 'Sale' | 'Lease';
    value: number;
  }[];
  specialAchievements: string[];
}

export interface Agent {
  id: string;
  userId: string; // Reference to User account
  name: string;
  title: string;
  email: string;
  phone: string;
  photo?: string;
  licenseNumber: string;
  licenseExpiry: Date;
  specializations: AgentSpecialization[];
  languages: AgentLanguage[];
  experience: number; // years
  bio: string;
  status: AgentStatus;
  certifications: AgentCertification[];
  performance: AgentPerformance;
  socialMedia: AgentSocialMedia;
  portfolio: AgentPortfolio;
  assignedProperties: string[]; // Property IDs
  schedule: {
    availableDays: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
    availableHours: {
      start: string; // HH:mm format
      end: string;
    };
    outOfOffice?: {
      startDate: Date;
      endDate: Date;
      reason: string;
    };
  };
  documents: {
    type: string;
    name: string;
    url: string;
    uploadDate: Date;
    expiryDate?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentCreateInput {
  userId: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  photo?: string;
  licenseNumber: string;
  licenseExpiry: Date;
  specializations: AgentSpecialization[];
  languages: AgentLanguage[];
  experience: number;
  bio: string;
}

export interface AgentUpdateInput {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  photo?: string;
  licenseNumber?: string;
  licenseExpiry?: Date;
  specializations?: AgentSpecialization[];
  languages?: AgentLanguage[];
  experience?: number;
  bio?: string;
  status?: AgentStatus;
} 