import http from './http-business.ts';

class HomeService {
    static get(data: string) {
		return http.get(`/enterprise/${data}`);
	}
}
export default HomeService;