import http from './http-business.ts';

class LeadsService {
  static get(data: string) {
    return http.get(`/leads/glance`);
  }

  static getTemplates() {
    return http.get(`/leads/templates`);
  }

  static getForms(companyId: string) {
    return http.get(`/leads/${companyId}`);
  }

  static getFormsDetails(id: string) {
    return http.get(`/leads/details/${id}`);
  }

  static post(data: any) {
    return http.post(`/leads`, data);
  }
  static getFormPreview(data: any) {
    const json = encodeURIComponent(JSON.stringify(data));
    return http.get(`/leads/form/preview?json=${json}`);
  }
}

export default LeadsService;
