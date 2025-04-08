import http from "./http-business.ts";

class ShopifyService {
  /**
   * Obtém as credenciais do Shopify para uma empresa.
   */
  static get(companyId: string) {
    return http.get(`/shopify/${companyId}`);
  }

  /**
   * Inicia o fluxo OAuth e retorna o link de autenticação do Shopify.
   * Requer também o domínio da loja (shop).
   */
  static getAuthLink(companyId: string, shop: string) {
    return http.get(`/shopify/auth-link?companyId=${companyId}&shop=${shop}`);
  }

  /**
   * Processa o callback OAuth e salva os tokens de acesso do Shopify.
   */
  static saveAuthToken(params: any) {
    return http.get(`/shopify/callback`, { params });
  }

  /**
   * Verifica se a conta do Shopify está conectada.
   */
  static async checkShopifyStatus(companyId: string) {
    const response = await http.get(`/shopify/status?companyId=${companyId}`);
    return response.data;
  }

  /**
   * Obtém a lista de produtos da loja integrada no Shopify.
   */
  static getProducts(companyId: string) {
    return http.get(`/shopify/products?companyId=${companyId}`);
  }

  /**
   * Obtém os níveis de estoque dos produtos da loja integrada no Shopify.
   */
  static getInventoryLevels(companyId: string) {
    return http.get(`/shopify/inventory-levels?companyId=${companyId}`);
  }

  /**
   * Atualiza o estoque de um produto específico no Shopify.
   * Espera um objeto contendo productId, quantity e companyId.
   */
  static updateStock(params: { productId: string; quantity: number; companyId: string }) {
    return http.post(`/shopify/update-stock`, params);
  }
}

export default ShopifyService;
