import http from './http-business.ts';

class PaymentService {
    static get(data: string) {
		return http.get(`http://localhost:3005/payment/${data}`);
	}
    static glance(data: string) {
		return http.get(`http://localhost:3005/payment/glance/${data}`);
	}
}
export default PaymentService;