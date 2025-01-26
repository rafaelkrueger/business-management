import http from './http-business.ts';

class ModulesService {
    static get(data: string) {
		return http.get(`/modules/${data}`);
	}
	static patch(data: any) {
		return http.patch(`/modules`, data);
	}

}
export default ModulesService;