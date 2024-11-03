import http from './http-business.ts';

class HomeService {
    static get(data: string) {
		return http.get(`http://localhost:3005/enterprise/${data}`);
	}
}
export default HomeService;