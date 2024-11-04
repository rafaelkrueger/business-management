import http from './http-business.ts';

class PaymentService {
    static get(data: string) {
		return http.get(`/payment/${data}`);
	}
    static glance(data: string) {
		return http.get(`/payment/glance/${data}`);
	}
}
export default PaymentService;