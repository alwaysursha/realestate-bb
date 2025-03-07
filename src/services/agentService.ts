import { Agent, AgentCreateInput, AgentUpdateInput, AgentStatus, AgentPerformance } from '@/types/agent';
import { userService } from './userService';

class AgentService {
  private agents: Agent[] = [];

  async getAgents(): Promise<Agent[]> {
    return this.agents;
  }

  async getAgentById(id: string): Promise<Agent | null> {
    return this.agents.find(agent => agent.id === id) || null;
  }

  async getAgentByUserId(userId: string): Promise<Agent | null> {
    return this.agents.find(agent => agent.userId === userId) || null;
  }

  async createAgent(input: AgentCreateInput): Promise<Agent> {
    // Verify user exists and has agent role
    const user = await userService.getUserById(input.userId);
    if (!user) throw new Error('User not found');
    if (user.role !== 'Agent') throw new Error('User must have Agent role');

    const newAgent: Agent = {
      id: Math.random().toString(36).substr(2, 9),
      ...input,
      status: 'Active',
      certifications: [],
      performance: {
        totalListings: 0,
        activeListings: 0,
        soldProperties: 0,
        totalSalesValue: 0,
        averageRating: 0,
        responseTime: 0,
        successRate: 0,
        monthlyStats: []
      },
      socialMedia: {},
      portfolio: {
        featuredListings: [],
        pastTransactions: [],
        specialAchievements: []
      },
      assignedProperties: [],
      schedule: {
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableHours: {
          start: '09:00',
          end: '18:00'
        }
      },
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.agents.push(newAgent);
    return newAgent;
  }

  async updateAgent(id: string, input: AgentUpdateInput): Promise<Agent | null> {
    const index = this.agents.findIndex(agent => agent.id === id);
    if (index === -1) return null;

    const updatedAgent = {
      ...this.agents[index],
      ...input,
      updatedAt: new Date()
    };

    this.agents[index] = updatedAgent;
    return updatedAgent;
  }

  async deleteAgent(id: string): Promise<boolean> {
    const index = this.agents.findIndex(agent => agent.id === id);
    if (index === -1) return false;

    this.agents.splice(index, 1);
    return true;
  }

  async updateAgentStatus(id: string, status: AgentStatus): Promise<Agent | null> {
    return this.updateAgent(id, { status });
  }

  async assignPropertyToAgent(agentId: string, propertyId: string): Promise<Agent | null> {
    const agent = await this.getAgentById(agentId);
    if (!agent) return null;

    if (!agent.assignedProperties.includes(propertyId)) {
      agent.assignedProperties.push(propertyId);
      agent.performance.activeListings += 1;
      agent.performance.totalListings += 1;
      agent.updatedAt = new Date();
    }

    return agent;
  }

  async removePropertyFromAgent(agentId: string, propertyId: string): Promise<Agent | null> {
    const agent = await this.getAgentById(agentId);
    if (!agent) return null;

    agent.assignedProperties = agent.assignedProperties.filter(id => id !== propertyId);
    agent.performance.activeListings = Math.max(0, agent.performance.activeListings - 1);
    agent.updatedAt = new Date();

    return agent;
  }

  async addCertification(agentId: string, certification: Agent['certifications'][0]): Promise<Agent | null> {
    const agent = await this.getAgentById(agentId);
    if (!agent) return null;

    agent.certifications.push(certification);
    agent.updatedAt = new Date();

    return agent;
  }

  async updatePerformance(agentId: string, performance: Partial<AgentPerformance>): Promise<Agent | null> {
    const agent = await this.getAgentById(agentId);
    if (!agent) return null;

    agent.performance = {
      ...agent.performance,
      ...performance
    };
    agent.updatedAt = new Date();

    return agent;
  }

  async addDocument(agentId: string, document: Agent['documents'][0]): Promise<Agent | null> {
    const agent = await this.getAgentById(agentId);
    if (!agent) return null;

    agent.documents.push(document);
    agent.updatedAt = new Date();

    return agent;
  }

  async updateSchedule(agentId: string, schedule: Partial<Agent['schedule']>): Promise<Agent | null> {
    const agent = await this.getAgentById(agentId);
    if (!agent) return null;

    agent.schedule = {
      ...agent.schedule,
      ...schedule
    };
    agent.updatedAt = new Date();

    return agent;
  }

  async addTransaction(agentId: string, transaction: Agent['portfolio']['pastTransactions'][0]): Promise<Agent | null> {
    const agent = await this.getAgentById(agentId);
    if (!agent) return null;

    agent.portfolio.pastTransactions.push(transaction);
    agent.performance.soldProperties += 1;
    agent.performance.totalSalesValue += transaction.value;
    agent.updatedAt = new Date();

    // Update monthly stats
    const month = transaction.transactionDate.toISOString().slice(0, 7); // YYYY-MM
    const monthStats = agent.performance.monthlyStats.find(stat => stat.month === month);
    if (monthStats) {
      monthStats.salesCount += 1;
      monthStats.salesValue += transaction.value;
    } else {
      agent.performance.monthlyStats.push({
        month,
        salesCount: 1,
        salesValue: transaction.value,
        newListings: 0
      });
    }

    return agent;
  }

  async getTopPerformers(limit: number = 5): Promise<Agent[]> {
    return [...this.agents]
      .sort((a, b) => b.performance.totalSalesValue - a.performance.totalSalesValue)
      .slice(0, limit);
  }
}

export const agentService = new AgentService(); 