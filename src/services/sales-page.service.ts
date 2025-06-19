import http from './http-business.ts';

class SalesPageService {
  static get() {
    return http.get(`/sales-pages/templates`);
  }

  static getSalesPages(companyId) {
    return http.get(`/sales-pages/${companyId}`);
  }

  static getSalesComponents() {
    return http.get(`/sales-pages/components`);
  }

  static post(body) {
    return http.post(`/sales-pages/activate`, body);
  }

  static postAiTemplate(body) {
    return http.post(`/sales-pages/ai-templates`, body);
  }

  static update(id, body) {
    return http.patch(`/sales-pages/${id}`, body);
  }

  static delete(id) {
    return http.delete(`/sales-pages/${id}`);
  }
}
export default SalesPageService;
