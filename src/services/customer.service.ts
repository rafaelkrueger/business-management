import http from './http-business.ts';

class CustomerService {
    static get(data: string) {
		return http.get(`http://localhost:3005/customer/${data}`);
	}

	static glance(data: string) {
		return http.get(`http://localhost:3005/customer/glance/${data}`);
	}

}
export default CustomerService;