import http from './http-business.ts';

class FunnelService {
  static list(companyId: string) {
    return http.get(`/funnels/${companyId}`);
  }

  static create(data: any) {
    return http.post('/funnels', data);
  }

  static update(id: string, data: any) {
    return http.patch(`/funnels/${id}`, data);
  }

  static detail(id: string) {
    return http.get(`/funnels/detail/${id}`);
  }

  static createStage(funnelId: string, data: any) {
    return http.post(`/funnel/${funnelId}/stages`, data);
  }

  static updateStages(funnelId: string, stages: string[]) {
    return http.patch(`/funnels/${funnelId}`, { stages });
  }

  static addLead(stageId: string, leadId: string) {
    return http.post(`/funnels/stages/${stageId}/leads`, { leadId });
  }

  static moveLead(entryId: string, toStageId: string) {
    return http.patch(`/funnels/leads/${entryId}/move`, { toStageId });
  }
}

export default FunnelService;
