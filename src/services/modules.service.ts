import http from './http-business.ts';

class ModulesService {
    static get(data: string) {
		return http.get(`/modules/${data}`);
	}
}
export default ModulesService;