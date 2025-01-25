import http from './http-business.ts';

class ConfigService {
    static getActiveModules() {
		return http.get(`/modules`);
	}
}
export default ConfigService;