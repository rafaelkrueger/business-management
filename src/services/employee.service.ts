import http from './http-business.ts';

class EmployeeService {
    static get(data: string) {
		return http.get(`http://localhost:3005/employee/${data}`);
	}
	static create(data: any) {
		return http.post(`http://localhost:3005/employee`, data);
	}
	static edit(data: any) {
		return http.patch(`http://localhost:3005/employee`, data);
	}
	static department(data: string) {
		return http.get(`http://localhost:3005/employee/departments/${data}`);
	}
	static glance(data: string) {
		return http.get(`http://localhost:3005/employee/glance/${data}`);
	}
}
export default EmployeeService;