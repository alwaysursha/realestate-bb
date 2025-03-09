import { Agent } from '@/types/agent';
import { initialAgents } from '@/data/agents';

const AGENTS_STORAGE_KEY = 'real_estate_agents';

// Mock interfaces to match the expected interface in the admin page
export interface AgentCreateInput {
  name: string;
  email: string;
  phone: string;
  bio: string;
  title: string;
  licenseNumber: string;
  licenseExpiry: Date;
  specializations: string[];
  languages: string[];
  experience: number;
  userId?: string;
}

export interface AgentUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  title?: string;
  licenseNumber?: string;
  licenseExpiry?: Date;
  specializations?: string[];
  languages?: string[];
  experience?: number;
  status?: string;
}

export type AgentStatus = 'Active' | 'On Leave' | 'Inactive';
export type AgentSpecialization = 'Luxury' | 'Commercial' | 'Residential' | 'Off-Plan' | 'International';

class AgentService {
  private getAgentsFromStorage(): Agent[] {
    if (typeof window === 'undefined') return initialAgents;
    
    const stored = localStorage.getItem(AGENTS_STORAGE_KEY);
    if (!stored) {
      this.saveAgentsToStorage(initialAgents);
      return initialAgents;
    }
    
    return JSON.parse(stored);
  }
  
  private saveAgentsToStorage(agents: Agent[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents));
  }

  async getAgents(): Promise<Agent[]> {
    return this.getAgentsFromStorage();
  }

  async getAgentById(id: string): Promise<Agent | null> {
    const agents = this.getAgentsFromStorage();
    return agents.find(agent => agent.id === id) || null;
  }

  async getAgentByUserId(userId: string): Promise<Agent | null> {
    const agents = this.getAgentsFromStorage();
    return agents.find(agent => agent.userId === userId) || null;
  }

  async createAgent(input: AgentCreateInput): Promise<Agent> {
    const agents = this.getAgentsFromStorage();
    
    // Convert the input to match our Agent interface
    const newAgent: Agent = {
      id: Math.random().toString(36).substring(2, 15),
      name: input.name,
      email: input.email,
      phone: input.phone,
      bio: input.bio,
      specialization: input.specializations,
      active: true,
      status: 'Active' as AgentStatus,
      specializations: input.specializations,
      title: input.title,
      licenseNumber: input.licenseNumber,
      licenseExpiry: input.licenseExpiry,
      languages: input.languages,
      experience: input.experience,
      userId: input.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    agents.push(newAgent);
    this.saveAgentsToStorage(agents);
    return newAgent;
  }

  async updateAgent(id: string, input: AgentUpdateInput): Promise<Agent | null> {
    const agents = this.getAgentsFromStorage();
    const index = agents.findIndex(a => a.id === id);
    
    if (index === -1) return null;
    
    // Update the agent with the input
    const updatedAgent: Agent = {
      ...agents[index],
      ...input,
      // Map specializations to specialization if provided
      specialization: input.specializations || agents[index].specialization,
      // Ensure status is of type AgentStatus
      status: input.status as AgentStatus || agents[index].status,
      updatedAt: new Date()
    };
    
    agents[index] = updatedAgent;
    this.saveAgentsToStorage(agents);
    return updatedAgent;
  }

  async deleteAgent(id: string): Promise<boolean> {
    const agents = this.getAgentsFromStorage();
    const index = agents.findIndex(a => a.id === id);
    
    if (index === -1) return false;
    
    agents.splice(index, 1);
    this.saveAgentsToStorage(agents);
    return true;
  }

  async updateAgentStatus(id: string, status: AgentStatus): Promise<Agent | null> {
    return this.updateAgent(id, { status });
  }

  async assignPropertyToAgent(agentId: string, propertyId: string): Promise<Agent | null> {
    const agent = await this.getAgentById(agentId);
    if (!agent) return null;
    
    const properties = agent.properties || [];
    if (!properties.includes(propertyId)) {
      properties.push(propertyId);
      return this.updateAgent(agentId, { properties } as any);
    }
    
    return agent;
  }

  async removePropertyFromAgent(agentId: string, propertyId: string): Promise<Agent | null> {
    const agent = await this.getAgentById(agentId);
    if (!agent) return null;
    
    const properties = (agent.properties || []).filter(id => id !== propertyId);
    return this.updateAgent(agentId, { properties } as any);
  }

  async addCertification(agentId: string, certification: string): Promise<Agent | null> {
    const agent = await this.getAgentById(agentId);
    if (!agent) return null;
    
    const specialization = [...(agent.specialization || [])];
    if (!specialization.includes(certification)) {
      specialization.push(certification);
      return this.updateAgent(agentId, { specialization } as any);
    }
    
    return agent;
  }

  async getTopPerformers(limit: number = 5): Promise<Agent[]> {
    const agents = this.getAgentsFromStorage();
    return [...agents]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
}

export const agentService = new AgentService(); 