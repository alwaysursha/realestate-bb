import { Property } from '@/types/property';
import { getAllProperties, getPropertyStats, getViewsData } from './propertiesService';
import { inquiryService } from './inquiryService';
import { userService } from './userService';
import { StatsData, ViewsData } from '@/types/stats';

export interface ReportData {
  date: string;
  propertyStats: {
    total: number;
    monthlyChange: number;
    isPositive: boolean;
    totalViews: number;
    viewsChange: number;
    isViewsChangePositive: boolean;
  };
  userStats: StatsData;
  inquiryStats: StatsData;
  viewsData: {
    totalViews: number;
    lastMonthViews: number;
    thisMonthViews: number;
  };
  popularProperties: {
    title: string;
    views: number;
    favorites: number;
    inquiries: number;
  }[];
}

export const reportService = {
  async generateReport(): Promise<ReportData> {
    try {
      // Get property stats
      const propertyStats = await getPropertyStats();
      
      // Get user stats
      const userStats = await userService.getUserStats();
      
      // Get inquiry stats
      const inquiryStats = await inquiryService.getInquiryStats();
      
      // Get views data
      const viewsData = await getViewsData();
      
      // Get all properties to find popular ones
      const properties = await getAllProperties();
      
      // Sort properties by views and take top 5
      const popularProperties = properties
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5)
        .map(property => ({
          title: property.title,
          views: property.viewCount || 0,
          favorites: Math.floor(Math.random() * 100), // Mock data for now
          inquiries: Math.floor(Math.random() * 50), // Mock data for now
        }));
      
      // Create report data
      const reportData: ReportData = {
        date: new Date().toISOString(),
        propertyStats: {
          total: propertyStats.total,
          monthlyChange: propertyStats.monthlyChange,
          isPositive: propertyStats.isPositive,
          totalViews: propertyStats.totalViews || 0,
          viewsChange: propertyStats.viewsChange || 0,
          isViewsChangePositive: propertyStats.isViewsChangePositive || false,
        },
        userStats,
        inquiryStats,
        viewsData,
        popularProperties,
      };
      
      return reportData;
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Failed to generate report');
    }
  },
  
  async getViewStats(): Promise<ViewsData> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const total = Math.floor(Math.random() * 10000);
    const monthlyChange = Math.floor(Math.random() * 100);
    const isPositive = Math.random() > 0.5;
    const change = Math.floor(Math.random() * 50);
    
    return {
      total,
      monthlyChange,
      isPositive,
      change
    };
  },
  
  // Convert report data to CSV format
  convertToCSV(reportData: ReportData): string {
    let csv = 'Real Estate Dashboard Report\n';
    csv += `Generated on: ${new Date(reportData.date).toLocaleString()}\n\n`;
    
    // Property Stats
    csv += 'PROPERTY STATISTICS\n';
    csv += `Total Properties,${reportData.propertyStats.total}\n`;
    csv += `Monthly Change,${reportData.propertyStats.monthlyChange}%,${reportData.propertyStats.isPositive ? 'Increase' : 'Decrease'}\n`;
    csv += `Total Views,${reportData.propertyStats.totalViews}\n`;
    csv += `Views Change,${reportData.propertyStats.viewsChange}%,${reportData.propertyStats.isViewsChangePositive ? 'Increase' : 'Decrease'}\n\n`;
    
    // User Stats
    csv += 'USER STATISTICS\n';
    csv += `Total Active Users,${reportData.userStats.total}\n`;
    csv += `Monthly Change,${reportData.userStats.monthlyChange}%,${reportData.userStats.isPositive ? 'Increase' : 'Decrease'}\n\n`;
    
    // Inquiry Stats
    csv += 'INQUIRY STATISTICS\n';
    csv += `Total Inquiries,${reportData.inquiryStats.total}\n`;
    csv += `Monthly Change,${reportData.inquiryStats.monthlyChange}%,${reportData.inquiryStats.isPositive ? 'Increase' : 'Decrease'}\n\n`;
    
    // Views Data
    csv += 'VIEWS BREAKDOWN\n';
    csv += `Total Views,${reportData.viewsData.totalViews}\n`;
    csv += `Last Month Views,${reportData.viewsData.lastMonthViews}\n`;
    csv += `This Month Views,${reportData.viewsData.thisMonthViews}\n\n`;
    
    // Popular Properties
    csv += 'POPULAR PROPERTIES\n';
    csv += 'Property Title,Views,Favorites,Inquiries\n';
    reportData.popularProperties.forEach(property => {
      csv += `"${property.title}",${property.views},${property.favorites},${property.inquiries}\n`;
    });
    
    return csv;
  },
  
  // Download report as CSV
  downloadCSV(csv: string, filename: string = 'real-estate-report.csv'): void {
    if (typeof window !== 'undefined') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}; 