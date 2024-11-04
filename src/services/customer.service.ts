import http from './http-business.ts';

class CustomerService {
    static get(data: string) {
		return http.get(`/customer/${data}`);
	}

	static glance(data: string) {
		return http.get(`/customer/glance/${data}`);
	}

}
export default CustomerService;