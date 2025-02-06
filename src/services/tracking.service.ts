import http from './http-business.ts';

class TrackingService {
	static get(companyId) {
		return http.get(`/tracking/${companyId}`);
	}
	static glancePageView(apiKey) {
		return http.get(`/tracking/glance/page-view/${apiKey}`);
	}

	static glancePerformance(apiKey) {
		return http.get(`/tracking/performance/${apiKey}`);
	}
    static create(body) {
		return http.post(`/tracking`, body);
	}
}
export default TrackingService;