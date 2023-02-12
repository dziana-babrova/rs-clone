import KEYS from 'const/LocalStorageKeys';

export default class LocalStorageService {
  static setAccessToken(token: string) {
    localStorage.setItem(KEYS.accessToken, token);
  }

  static getAccessToken() {
    return localStorage.getItem(KEYS.accessToken);
  }

  static removeAccessToken() {
    localStorage.removeItem(KEYS.accessToken);
  }
}
