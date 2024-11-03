import http from './http-business.ts';

class CalendarService {
    static get(data: any) {
		return http.get(`http://localhost:3005/calendar?userId=${data.userId}&companyId=${data.companyId}`);
	}
	static post(data: any) {
		return http.post(`http://localhost:3005/calendar`, data);
	}
	static delete(data: any) {
		return http.delete(`http://localhost:3005/calendar/${data}`);
	  }

}
export default CalendarService;