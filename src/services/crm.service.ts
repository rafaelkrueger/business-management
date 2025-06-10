import http from './http-business.ts';

class CrmService {
  static getCrm(companyId: string) {
    return http.get(`/crm/${companyId}`);
  }

  static createCustomer(companyId: string, data: any) {
    return http.post('/crm', { ...data, companyId });
  }

  static updateCustomer(id: string, data: any) {
    return http.patch('/crm', { ...data, id });
  }

  static deleteCustomer(id: string) {
    return http.delete(`/crm/${id}`);
  }
}

export default CrmService;
