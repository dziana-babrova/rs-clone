import LocalStorageKeys from 'const/LocalStorageKeys';

export default class LocalStorageService {
  static setItem<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
  }

  static getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    try {
      return JSON.parse(item);
    } catch {
      console.error('Wrong format of data');
      return null;
    }
  }

  static setAccessToken(token: string) {
    localStorage.setItem(LocalStorageKeys.accessToken, token);
  }

  static getAccessToken() {
    return localStorage.getItem(LocalStorageKeys.accessToken);
  }

  static removeAccessToken() {
    localStorage.removeItem(LocalStorageKeys.accessToken);
  }
}
