import { Property } from './property';

export type InquiryStatus = 'New' | 'In Progress' | 'Resolved' | 'Cancelled';

export interface InquiryNote {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

export interface StatusHistoryEntry {
  status: InquiryStatus;
  changedAt: Date;
  changedBy: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertySnapshot: {
    id: string;
    title: string;
    price: number;
    location: string;
    mainImage: string;
  };
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: InquiryStatus;
  notes: InquiryNote[];
  statusHistory: StatusHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InquiryCreateInput {
  propertyId: string;
  propertySnapshot: {
    id: string;
    title: string;
    price: number;
    location: string;
    mainImage: string;
  };
  name: string;
  email: string;
  phone?: string;
  message: string;
} 