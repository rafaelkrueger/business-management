import http from './http-business.ts';

class ChatbotService {
  static async getAllBots() {
    const response = await http.get('/chatbot');
    return response.data;
  }

  static async getBotBySlug(slug: string) {
    const response = await http.get(`/chatbot/by-slug`, {
      params: { slug }
    });
    return response.data;
  }

    static async getBotByCompanyId(activeCompanyId: string) {
    const response = await http.get(`/chatbot/${activeCompanyId}`);
    return response.data;
  }

  static async createBot(formData: FormData) {
    const response = await http.post('/chatbot', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  static async sendMessageToBot({ chatId, slug, message }: { chatId: string; slug: string; message: string }) {
    const response = await http.post('/chatbot/message', {
      chatId,
      slug,
      message
    });
    return response.data;
  }

  static async getHistory(botId: string) {
    const response = await http.get(`/chatbot/history/${botId}`);
    return response.data;
  }

  static async deleteThread(threadId: string) {
    const response = await http.delete(`/chatbot/history/${threadId}`);
    return response.data;
  }
}

export default ChatbotService;
