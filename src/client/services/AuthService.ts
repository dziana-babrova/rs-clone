import { AuthResponse } from 'common/types/types';
import { AxiosResponse } from 'axios';
import api from 'client/axios/axios';

export default class AuthService {
  static async signIn(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>('/auth/signin', {
      email,
      password,
    });
  }

  static async signUp(
    email: string,
    username: string,
    password: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>('/auth/signup', {
      email,
      username,
      password,
    });
  }

  static async signOut(): Promise<void> {
    api.get('/auth/signout');
  }

  static async refresh(): Promise<AxiosResponse<AuthResponse>> {
    return api.get('/auth/refresh');
  }
}
