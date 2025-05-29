import http from "./http-business.ts";

class InstagramService {
  /**
   * Gets Instagram credentials for a company.
   */
  static get(companyId) {
    return http.get(`/instagram/${companyId}`);
  }

  /**
   * Starts OAuth flow and returns Instagram authentication link.
   */
  static getAuthLink(companyId) {
    return http.get(`/instagram/auth-link?companyId=${companyId}`);
  }

  /**
   * Checks connected Instagram accounts/businesses.
   */
  static checkInstagramAccounts(companyId) {
    return http.get(`/instagram/accounts?companyId=${companyId}`);
  }

  /**
   * Saves OAuth tokens after authentication.
   */
  static saveAuthToken(params) {
    return http.get(`/instagram/callback`, { params });
  }

  /**
   * Checks if user is already authenticated with Instagram.
   */
  static async checkInstagramStatus(companyId) {
    const response = await http.get(`/instagram/status?companyId=${companyId}`);
    return response.data;
  }
}

export default InstagramService;