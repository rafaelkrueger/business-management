import http from './http-business.ts';

class CrmService {
    static getCrm(copmanyId) {
        return http.get(`/crm/${copmanyId}`);
    }
}
export default CrmService;