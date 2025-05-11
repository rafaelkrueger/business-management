import http from './http-business.ts';

class UserProgressService {
  static get(companyId, moduleKey) {
    return http.get(`/user-progress/${companyId}`);
  }

  static update(data) {
    return http.post(`/user-progress`, data);
  }
}

export default UserProgressService;
