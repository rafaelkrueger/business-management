import http from './http-business.ts';

class TwitterService {
	static get(companyId) {
		return http.get(`/twitter/${companyId}`);
	}
    static create(body) {
		return http.post(`/twitter/create`, body);
	}
    static createPost(body) {
		return http.post(`/twitter/post`, body);
	}
}
export default TwitterService;