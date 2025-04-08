import http from './http-business.ts';

class EngagementService {
    static get(companyId: string) {
		return http.get(`/engagement/${companyId}`);
	}
}
export default EngagementService;