import http from './http-all-in-one.ts';

class AllInOneService {
    static get(data: any) {
		return http.post(`https://all-in-one-system-cfe0c681a225.herokuapp.com/user/sign-in`, data);
	}
	static create(data: any) {
		return http.post('https://all-in-one-system-cfe0c681a225.herokuapp.com/user/sign-up', data);
	}
    static getUserByToken(data: any) {
		return http.get(`https://all-in-one-system-cfe0c681a225.herokuapp.com/user/token/${data}`);
	}
	static delete(data: any) {
		return http.delete(`//${data}`);
	}

}
export default AllInOneService;