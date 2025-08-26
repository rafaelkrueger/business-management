import http from './http-business.ts';

class ChatAiService {
  static async startConversation() {
    const response = await http.post('/ai/chat/start');
    return response.data.conversationId;
  }

  static async getEnabledFeatures(companyId){
    return await http.get(`/ai/chat/features/${companyId}`);
  }

static async sendMessage(conversationId: string, message: string, companyId: string, language: string, image?:string) {
  const formData = new FormData();
  formData.append('message', message);
  formData.append('companyId', companyId);
  formData.append('language', language);

  if (image) {
    formData.append('image', image);
  }

  const response = await http.post(`/ai/chat/${conversationId}/message`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}


  static async sendFileMessage(conversationId: string, formData: FormData) {
    const response = await http.post(`/ai/chat/${conversationId}/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  static async getConversation(conversationId: string) {
    const response = await http.get(`/ai/chat/${conversationId}`);
    return response.data;
  }

  static async getConversationByCompany(companyId: string) {
    const response = await http.get(`/ai/chat/${companyId}`);
    return response.data;
  }

  static async getThreadInfo(companyId: string) {
    const response = await http.get(`/ai/chat/${companyId}/thread-info`);
    return response.data;
  }

  static async clearThreadCache(companyId: string) {
    const response = await http.post(`/ai/chat/${companyId}/clear-cache`);
    return response.data;
  }

}

export default ChatAiService;