import http from './http-business.ts';

class ChatbotService {
  static async getAllBots() {
    const response = await http.get('/ai-company-agent');
    return response.data;
  }

  static async getBotBySlug(slug: string) {
    const response = await http.get(`/ai-company-agent/by-slug`, {
      params: { slug }
    });
    return response.data;
  }

  static async createBot(botData: {
    name: string;
    instruction: string;
    companyId: string;
    welcomeMessage?: string;
    generateTemplates?: boolean;
  }) {
    const response = await http.post('/ai-company-agent', botData);
    return response.data;
  }
}

export default ChatbotService;
