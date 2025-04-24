import http from './http-business.ts';

class EmailService {
    static createAccount(body) {
		return http.post(`email/create-account`, body);
	}
    static getAccount(companyId) {
		return http.get(`email/${companyId}`);
	}

	static postAiTemplate(body) {
		return http.post(`/email/create-template`,body);
	}
}
export default EmailService;