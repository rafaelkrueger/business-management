import http from './http-business.ts';

class OrdersService {
    static get(data: string) {
		return http.get(`/order/${data}`);
	}
    static post(data: any) {
		return http.post(`/order`, data);
	}
    static addProduct(data: any) {
		return http.post(`/order/add-product`, data);
	}
    static removeProduct(data: any) {
		return http.post(`/order/remove-product`, data);
	}
    static edit(data: any) {
		return http.patch(`/order`, data);
	}
    static delete(data: any) {
		return http.delete(`/order/${data}`);
	}
}
export default OrdersService;