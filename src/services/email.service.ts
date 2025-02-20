import http from './http-business.ts';

class EmailService {
    static createAccount(body) {
		return http.post(`email/create-account`, body);
	}
    static getAccount(companyId) {
		return http.get(`email/${companyId}`);
	}
}
export default EmailService;