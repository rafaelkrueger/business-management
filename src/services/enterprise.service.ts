import http from './http-business.ts';

class EnterpriseService {
    static post(data) {
		return http.post(`/enterprise`, data);
	}
}
export default EnterpriseService;