import http from './http-business.ts';

class EmployeeService {
    static get(data: string) {
		return http.get(`/employee/${data}`);
	}
	static create(data: any) {
		return http.post(`/employee`, data);
	}
	static edit(data: any) {
		return http.patch(`/employee`, data);
	}
	static department(data: string) {
		return http.get(`/employee/departments/${data}`);
	}
	static glance(data: string) {
		return http.get(`/employee/glance/${data}`);
	}
}
export default EmployeeService;