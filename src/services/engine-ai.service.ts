import http from './http-business.ts';

export interface ThoughtStep {
  step: number;
  thought: string;
  action: string;
  reasoning: string;
  timestamp: Date;
}

export interface DoDCriteria {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  details?: string;
}

export interface DoDStatus {
  module: string;
  criteria: DoDCriteria[];
  overallCompletion: number;
  nextSteps: string[];
}

export interface EngineContext {
  companyId: string;
  currentModule: string;
  currentTask: string;
  progress: number;
  completedSteps: string[];
  pendingSteps: string[];
  companyInfo: Record<string, any>;
  userPreferences: Record<string, any>;
}

export interface EngineResponse {
  response: string;
  nextAction?: string;
  suggestedModule?: string;
  progress: number;
  context: EngineContext;
  recommendations: string[];
  thoughtProcess: ThoughtStep[];
  currentDoD: DoDStatus;
  reasoning: string;
}

class EngineAiService {
  /**
   * Processa uma mensagem usando o Engine AI
   */
  async processMessage(
    companyId: string,
    message: string,
    language: 'en' | 'pt' = 'pt'
  ): Promise<EngineResponse> {
    try {
      const response = await http.post(`/ai/engine/${companyId}/process`, {
        message,
        language
      });

      return response.data;
    } catch (error) {
      console.error('Error processing message with Engine AI:', error);
      throw error;
    }
  }

  /**
   * Obtém o contexto atual do Engine
   */
  async getEngineContext(companyId: string): Promise<EngineContext | null> {
    try {
      const response = await http.get(`/ai/engine/${companyId}/context`);
      return response.data;
    } catch (error) {
      console.error('Error getting engine context:', error);
      return null;
    }
  }

  /**
   * Obtém o progresso atual do Engine
   */
  async getEngineProgress(companyId: string): Promise<{
    progress: number;
    currentModule: string;
    completedSteps: string[];
    pendingSteps: string[];
  }> {
    try {
      const response = await http.get(`/ai/engine/${companyId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error getting engine progress:', error);
      throw error;
    }
  }

  /**
   * Obtém o status do onboarding de forma otimizada
   */
  async getOnboardingStatus(companyId: string): Promise<{
    isComplete: boolean;
    progress: number;
    completedFields: string[];
    missingFields: string[];
    lastUpdated: Date;
  }> {
    try {
      const response = await http.get(`/ai/engine/${companyId}/onboarding-status`);
      return response.data;
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      throw error;
    }
  }

  /**
   * Reseta o contexto do Engine
   */
  async resetEngine(companyId: string): Promise<void> {
    try {
      await http.post(`/ai/engine/${companyId}/reset`);
    } catch (error) {
      console.error('Error resetting engine:', error);
      throw error;
    }
  }

  /**
   * Inicializa o Engine para uma empresa
   */
  async initializeEngine(companyId: string): Promise<EngineContext> {
    try {
      const response = await http.post(`/ai/engine/${companyId}/initialize`);
      return response.data;
    } catch (error) {
      console.error('Error initializing engine:', error);
      throw error;
    }
  }

  /**
   * Reset ALL company data (complete reset)
   */
  async resetAllCompanyData(companyId: string): Promise<void> {
    try {
      await http.post(`/ai/engine/${companyId}/reset-all`);
    } catch (error) {
      console.error('Error resetting all company data:', error);
      throw error;
    }
  }
}

export default new EngineAiService();
