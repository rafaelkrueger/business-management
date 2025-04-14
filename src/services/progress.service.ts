import http from './http-business.ts';

class ProgressService {
    static getProgress(activeCompany) {
        return http.get(`/progress/${activeCompany}`);
    }
}
export default ProgressService;