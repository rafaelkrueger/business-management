import http from './http-business.ts';

class EnterpriseService {
    static post(data) {
		return http.post(`/enterprise`, data);
	}
	static get(companyId) {
		return http.get(`/enterprise/information/${companyId}`);
	}
	static update(body) {
		return http.patch(`/enterprise/information`, body);
	}
}
export default EnterpriseService;