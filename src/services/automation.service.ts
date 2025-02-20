import http from './http-business.ts';

class AutomationService {
    static createAutomation(body) {
		return http.post(`/automation`, body);
	}
	static editAutomation(body) {
		return http.patch(`/automation`, body);
	}
	static getAutomation(activeCompany) {
		return http.get(`/automation/${activeCompany}`);
	}
	static getEmailTemplates() {
		return http.get(`/automation/email/templates`);
	}
	static deleteAutomation(id) {
		return http.delete(`/automation/${id}`);
	}


}
export default AutomationService;