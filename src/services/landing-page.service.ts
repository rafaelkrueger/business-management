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

        static postAiTemplate(body) {
                return http.post(`/landing-pages/ai-templates`,body);
        }

        static update(id, body) {
                return http.patch(`/landing-pages/${id}`, body);
        }

        static delete(id) {
                return http.delete(`/landing-pages/${id}`);
        }
}
export default LandingPageService;