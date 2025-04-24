import http from './http-business.ts';

class ChatAiService {
  static async startConversation() {
    const response = await http.post('/ai/chat/start');
    return response.data.conversationId;
  }

  static async sendMessage(conversationId: string, message: string, activeCompany:string) {
    const response = await http.post(`/ai/chat/${conversationId}/message`, { message, companyId:activeCompany });
    return response.data;
  }

  static async getConversation(conversationId: string) {
    const response = await http.get(`/ai/chat/${conversationId}`);
    return response.data;
  }
}

export default ChatAiService;
