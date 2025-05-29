import http from './http-business.ts';

class MarketingService {
  static get(companyId: string) {
    return http.get(`/marketing/${companyId}`);
  }
}

export default MarketingService;
