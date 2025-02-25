import http from "./http-business.ts";

class WhatsappService {
  /**
   * Obtém as credenciais do Twitter para uma empresa.
   */
  static get(companyId) {
    return http.get(`/facebook/${companyId}`);
  }

  /**
   * Inicia o fluxo OAuth e retorna o link de autenticação do Twitter.
   */
  static getAuthLink(companyId) {
    return http.get(`/whatsapp/auth-link?companyId=${companyId}`);
  }

  /**
   * Verifica se a conta do Twitter está conectada.
   */
  static checkTwitterAccount(companyId) {
    return http.get(`/whatsapp/check?companyId=${companyId}`);
  }

  /**
   * Salva os tokens OAuth do Twitter após autenticação.
   */
  static saveAuthToken(params) {
    return http.get(`/whatsapp/callback`, { params });
  }

  /**
   * Verifica se o usuário já está autenticado no Twitter.
   */
  static async checkLinkedinStatus(companyId) {
    const response = await http.get(`/whatsapp/status?companyId=${companyId}`);
    return response.data;
  }
}

export default WhatsappService;
