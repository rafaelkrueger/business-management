import http from './http-business.ts';

class CalendarService {
    static get(data: any) {
		return http.get(`/calendar?userId=${data.userId}&companyId=${data.companyId}`);
	}
	static post(data: any) {
		return http.post(`/calendar`, data);
	}
	static delete(data: any) {
		return http.delete(`/calendar/${data}`);
	  }

}
export default CalendarService;