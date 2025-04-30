import http from './http-business.ts';

class PaymentService {
  static createSubscription(data: { email: string; priceId: string, paymentMethodId:string, userId:string }) {
    return http.post('/payment/subscribe', data);
  }
}

export default PaymentService;