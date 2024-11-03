import http from './http-business.ts';

class ProductService {
    static get(data: string) {
		return http.get(`http://localhost:3005/product/${data}`);
	}
	static create(formData: any, activeCompany:string) {
		return http.post(`http://localhost:3005/product`, {formData:formData, activeCompany});
	}
	static edit(formData: any, activeCompany:string) {
		return http.patch(`http://localhost:3005/product`, {formData:formData, activeCompany});
	}
    static glance(data: string) {
		return http.get(`http://localhost:3005/product/glance/${data}`);
	}
}
export default ProductService;