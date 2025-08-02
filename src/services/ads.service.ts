import http from './http-business.ts';

class AdsService {
  static getCampaigns(companyId: string) {
    return http.get(`/ads/${companyId}`);
  }

  static createCampaign(companyId: string, data: any) {
    return http.post(`/ads/${companyId}`, data);
  }

  static optimizeCampaign(companyId: string, campaignId: string) {
    return http.post(`/ads/${companyId}/${campaignId}/optimize`);
  }
}

export default AdsService;
