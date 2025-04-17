import http from './http-business.ts';

class AiService {
    static getAiAssistant(companyId) {
		return http.get(`/ai/ai-assistant/${companyId}`);
	}

	static askQuickQuestion(companyId, question) {
		return http.get(`/ai/ask-question?companyId=${companyId}&question=${question}`);
	}

	static askQuickImage(formData: FormData) {
		return http.post(`/ai/ask-quick-image`, formData, {
		  headers: {
			'Content-Type': 'multipart/form-data',
		  },
		});
	  }

    static craeteAiAssistant(body) {
		return http.post(`/ai/create-assistant`, body);
	}

	static glance(type,companyId) {
		return http.get(`/ai/glance?type=${type}&companyId=${companyId}`);
	}
}
export default AiService;