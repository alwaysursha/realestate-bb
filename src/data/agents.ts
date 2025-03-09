import { Agent } from '@/types/agent';

export const initialAgents: Agent[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+971 50 123 4567",
    bio: "Experienced real estate agent specializing in luxury properties",
    specialization: ["Luxury", "Residential", "Commercial"],
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    properties: ["prop1", "prop2", "prop3"],
    rating: 4.8,
    reviews: 24,
    active: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20")
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+971 50 987 6543",
    bio: "Dedicated agent with 10+ years of experience in Dubai real estate market",
    specialization: ["Residential", "Off-Plan", "Investment"],
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
    properties: ["prop4", "prop5"],
    rating: 4.9,
    reviews: 36,
    active: true,
    createdAt: new Date("2022-11-05"),
    updatedAt: new Date("2023-07-12")
  },
  {
    id: "3",
    name: "Mohammed Al Farsi",
    email: "mohammed.alfarsi@example.com",
    phone: "+971 55 444 7777",
    bio: "Local expert specializing in premium properties in Downtown Dubai",
    specialization: ["Luxury", "Residential", "Commercial"],
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
    properties: ["prop6", "prop7", "prop8", "prop9"],
    rating: 4.7,
    reviews: 42,
    active: true,
    createdAt: new Date("2022-08-18"),
    updatedAt: new Date("2023-05-30")
  }
]; 