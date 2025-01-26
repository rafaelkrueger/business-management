import http from './http-business.ts';

class EnterpriseService {
  static post(data) {
    return http.post(`/enterprise`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  static get(companyId) {
    return http.get(`/enterprise/information/${companyId}`);
  }
  static async update(formData) {
    return http.patch(`/enterprise/information`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default EnterpriseService;
