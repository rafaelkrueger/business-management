import http from './http-business.ts';

class ProductService {
    static get(data: string) {
		return http.get(`/product/${data}`);
	}
	static getProductsByIds(ids: string[]) {
		const query = ids.join(',');
		return http.get(`/product?ids=${query}`);
	  }
	static create(formData: any, activeCompany:string) {
		return http.post(`/product`, {formData:formData, activeCompany});
	}
	static edit(formData: any, activeCompany:string) {
		return http.patch(`/product`, {formData:formData, activeCompany});
	}
    static glance(data: string) {
		return http.get(`/product/glance/${data}`);
	}
	static delete(productId: string, activeCompany: string) {
		return http.delete(`/product/${productId}/${activeCompany}`);
	}
}
export default ProductService;