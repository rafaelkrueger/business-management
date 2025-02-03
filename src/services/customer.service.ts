import http from './http-business.ts';

class CustomerService {
  static get(companyId: string) {
    return http.get(`/customer/${companyId}`);
  }

  static glance(companyId: string) {
    return http.get(`/customer/glance/${companyId}`);
  }

  static create(data: any) {
    return http.post('/customer', data);
  }

  static update(customerId:string,data: any) {
    return http.patch(`/customer/${customerId}`, data);
  }
}

export default CustomerService;
