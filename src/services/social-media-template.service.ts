import http from './http-business.ts';

class SoaiclMediaTemplateService {
    static get() {
        return http.get(`/social-media-template`);
    }
}
export default SoaiclMediaTemplateService;