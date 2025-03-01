import http from "./http-business.ts";

class YouTubeService {
  /**
   * Obtém as credenciais do YouTube para uma empresa.
   */
  static get(companyId: string) {
    return http.get(`/youtube/${companyId}`);
  }

  /**
   * Inicia o fluxo OAuth e retorna o link de autenticação do YouTube.
   */
  static getAuthLink(companyId: string) {
    return http.get(`/youtube/auth-link?companyId=${companyId}`);
  }

  /**
   * Verifica se a conta do YouTube está conectada.
   */
  static checkYoutubeAccount(companyId: string) {
    return http.get(`/youtube/check?companyId=${companyId}`);
  }

  /**
   * Salva os tokens OAuth do YouTube após autenticação.
   */
  static saveAuthToken(params: any) {
    return http.get(`/youtube/callback`, { params });
  }

  /**
   * Verifica se o usuário já está autenticado no YouTube.
   */
  static async checkYoutubeStatus(companyId: string) {
    const response = await http.get(`/youtube/status?companyId=${companyId}`);
    return response.data;
  }
}

export default YouTubeService;
