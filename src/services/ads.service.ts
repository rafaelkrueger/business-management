import http from './http-business.ts';

class AdsService {
  static create(data: any) {
    return http.post(`/advertisements`, data);
  }

  static getAll(companyId: string) {
    return http.get(`/advertisements?companyId=${companyId}`);
  }

  static get(id: string) {
    return http.get(`/advertisements/${id}`);
  }

  static update(id: string, data: any) {
    return http.put(`/advertisements/${id}`, data);
  }

  static remove(id: string) {
    return http.delete(`/advertisements/${id}`);
  }

  static sync(id: string) {
    return http.post(`/advertisements/${id}/sync`);
  }

  static connectAccount(data: any) {
    return http.post(`/advertisements/accounts`, data);
  }

  static listAccounts(companyId: string) {
    return http.get(`/advertisements/accounts?companyId=${companyId}`);
  }
}

export default AdsService;

