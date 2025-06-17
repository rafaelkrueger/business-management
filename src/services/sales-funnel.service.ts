import http from './http-business.ts';

class SalesFunnelService {
  static list(companyId: string) {
    return http.get(`/crm/funnels/${companyId}`);
  }

  static detail(id: string) {
    return http.get(`/crm/funnels/detail/${id}`);
  }

  static create(data: any) {
    return http.post('/crm/funnels', data);
  }

  static update(id: string, data: any) {
    return http.patch(`/crm/funnels/${id}`, data);
  }

  static createStage(funnelId: string, data: any) {
    return http.post(`/crm/funnels/${funnelId}/stages`, data);
  }

  static updateStage(id: string, data: any) {
    return http.patch(`/crm/funnels/stages/${id}`, data);
  }

  static addLead(stageId: string, leadId: string) {
    return http.post(`/crm/funnels/stages/${stageId}/leads`, { leadId });
  }

  static moveLead(entryId: string, toStageId: string) {
    return http.patch(`/crm/funnels/leads/${entryId}/move`, { toStageId });
  }
}

export default SalesFunnelService;
