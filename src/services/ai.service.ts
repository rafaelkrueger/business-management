import http from './http-business.ts';

class AiService {
    static getAiAssistant(companyId) {
		return http.get(`/ai/ai-assistant/${companyId}`);
	}

	static askQuickQuestion(companyId, question) {
		return http.get(`/ai/ask-question?companyId=${companyId}&question=${question}`);
	}

    static craeteAiAssistant(body) {
		return http.post(`/ai/create-assistant`, body);
	}

	static glance(type,companyId) {
		return http.get(`/ai/glance?type=${type}&companyId=${companyId}`);
	}
}
export default AiService;