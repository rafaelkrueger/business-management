import http from "./http-business.ts";

class WhatsappService {
  /**
   * Obtém o QR Code para conectar um novo número de WhatsApp.
   */
  static getQrCode(companyId) {
    return http.get(`/whatsapp/get-qr?companyId=${companyId}`);
  }

  /**
   * Verifica o status da conexão do WhatsApp.
   */
  static checkWhatsAppStatus(companyId) {
    return http.get(`/whatsapp/status?companyId=${companyId}`);
  }

  /**
   * Envia uma mensagem via WhatsApp usando o número vinculado.
   */
  static sendMessage(params) {
    return http.post(`/whatsapp/send`, params);
  }
}

export default WhatsappService;
