import { Inquiry, InquiryCreateInput, InquiryNote, InquiryStatus } from '@/types/inquiry';
import { v4 as uuidv4 } from 'uuid';

class InquiryService {
  private storageKey = 'inquiries';

  private getInquiriesFromStorage(): Inquiry[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      // Initialize with default inquiries
      const defaultInquiries = this.createDefaultInquiries();
      this.saveInquiriesToStorage(defaultInquiries);
      return defaultInquiries;
    }

    try {
      const inquiries = JSON.parse(stored);
      return inquiries.map((inquiry: any) => ({
        ...inquiry,
        createdAt: new Date(inquiry.createdAt),
        updatedAt: new Date(inquiry.updatedAt),
        notes: inquiry.notes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        })),
        statusHistory: inquiry.statusHistory.map((entry: any) => ({
          ...entry,
          changedAt: new Date(entry.changedAt)
        }))
      }));
    } catch (error) {
      console.error('Error parsing inquiries:', error);
      return [];
    }
  }

  private createDefaultInquiries(): Inquiry[] {
    const mockInquiries: Inquiry[] = [
      {
        id: '1',
        propertyId: '1',
        propertySnapshot: {
          id: '1',
          title: 'Luxury Villa',
          price: 1500000,
          location: 'Beverly Hills',
          mainImage: '/images/properties/villa1.jpg'
        },
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'I am interested in viewing this property.',
        status: 'New',
        notes: [],
        statusHistory: [{
          status: 'New',
          changedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          changedBy: 'system'
        }],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];

    return mockInquiries;
  }

  private saveInquiriesToStorage(inquiries: Inquiry[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(inquiries));
  }

  async getInquiries(): Promise<Inquiry[]> {
    return this.getInquiriesFromStorage();
  }

  async getInquiryById(id: string): Promise<Inquiry | null> {
    const inquiries = await this.getInquiries();
    return inquiries.find(inquiry => inquiry.id === id) || null;
  }

  async createInquiry(input: InquiryCreateInput): Promise<Inquiry> {
    const inquiries = await this.getInquiries();
    
    const newInquiry: Inquiry = {
      id: uuidv4(),
      ...input,
      status: 'New',
      notes: [],
      statusHistory: [{
        status: 'New',
        changedAt: new Date(),
        changedBy: 'system'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.saveInquiriesToStorage([...inquiries, newInquiry]);
    return newInquiry;
  }

  async updateInquiryStatus(id: string, newStatus: InquiryStatus, updatedBy: string): Promise<Inquiry | null> {
    const inquiries = await this.getInquiries();
    const inquiryIndex = inquiries.findIndex(inq => inq.id === id);
    
    if (inquiryIndex === -1) return null;

    const updatedInquiry = {
      ...inquiries[inquiryIndex],
      status: newStatus,
      updatedAt: new Date(),
      statusHistory: [
        ...inquiries[inquiryIndex].statusHistory,
        {
          status: newStatus,
          changedAt: new Date(),
          changedBy: updatedBy
        }
      ]
    };

    inquiries[inquiryIndex] = updatedInquiry;
    this.saveInquiriesToStorage(inquiries);
    return updatedInquiry;
  }

  async addNote(id: string, content: string, createdBy: string): Promise<Inquiry | null> {
    const inquiries = await this.getInquiries();
    const inquiryIndex = inquiries.findIndex(inq => inq.id === id);
    
    if (inquiryIndex === -1) return null;

    const newNote: InquiryNote = {
      id: uuidv4(),
      content,
      createdAt: new Date(),
      createdBy
    };

    const updatedInquiry = {
      ...inquiries[inquiryIndex],
      notes: [...inquiries[inquiryIndex].notes, newNote],
      updatedAt: new Date()
    };

    inquiries[inquiryIndex] = updatedInquiry;
    this.saveInquiriesToStorage(inquiries);
    return updatedInquiry;
  }

  async getInquiriesByPropertyId(propertyId: string): Promise<Inquiry[]> {
    const inquiries = await this.getInquiries();
    return inquiries.filter(inquiry => inquiry.propertyId === propertyId);
  }

  async initializeMockData(): Promise<void> {
    const existingInquiries = await this.getInquiries();
    if (existingInquiries.length > 0) return;

    const mockInquiries: InquiryCreateInput[] = [
      {
        propertyId: '1',
        propertySnapshot: {
          id: '1',
          title: 'Luxury Villa',
          price: 1500000,
          location: 'Beverly Hills',
          mainImage: '/images/properties/villa1.jpg'
        },
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'I am interested in viewing this property.'
      },
      // Add more mock inquiries as needed
    ];

    for (const inquiry of mockInquiries) {
      await this.createInquiry(inquiry);
    }
  }

  async getInquiryStats() {
    const inquiries = await this.getInquiries();
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const total = inquiries.length;
    const lastMonthInquiries = inquiries.filter(inq => new Date(inq.createdAt) >= lastMonth).length;
    const previousMonthInquiries = inquiries.filter(inq => {
      const date = new Date(inq.createdAt);
      return date >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate()) &&
             date < lastMonth;
    }).length;

    const monthlyChange = lastMonthInquiries - previousMonthInquiries;
    const isPositive = monthlyChange >= 0;

    return {
      total,
      monthlyChange: Math.abs(monthlyChange),
      isPositive
    };
  }
}

export const inquiryService = new InquiryService(); 