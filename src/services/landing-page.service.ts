import http from './http-business.ts';

class LandingPageService {
    static get() {
		return http.get(`/landing-pages/templates`);
	}
	static getlandingPages(companyId) {
		return http.get(`/landing-pages/${companyId}`);
	}
	static getlandingComponents() {
		return http.get(`/landing-pages/components`);
	}
	static post(body) {
		return http.post(`/landing-pages/activate`,body);
	}
}
export default LandingPageService;