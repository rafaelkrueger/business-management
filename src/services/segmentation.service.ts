import http from './http-business.ts';

class SegmentationService {
  static getSegments(companyId: string) {
    return http.get(`/crm/segments/${companyId}`);
  }

  static createSegment(data: any) {
    return http.post('/crm/segments', data);
  }

  static updateSegment(id: string, data: any) {
    return http.patch(`/crm/segments/${id}`, data);
  }

  static deleteSegment(id: string) {
    return http.delete(`/crm/segments/${id}`);
  }
}

export default SegmentationService;
