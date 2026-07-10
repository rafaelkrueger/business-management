import http from './http-business.ts';

class AuthService {
  static signIn(data: any) {
    return http.post('user/sign-in', data);
  }

  static signUp(data: any) {
    return http.post('user/sign-up', data);
  }

  static getUserByToken(data: any) {
    const tokenValue = data?.accessToken || data;
    return http.get(`user/token/${tokenValue}`);
  }

  static sendContact(data: any) {
    return http.post('user/contact', data);
  }
}

export default AuthService;
