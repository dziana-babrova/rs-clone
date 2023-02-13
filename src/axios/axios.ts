import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import SERVER_PROPS from 'const/Server';
import LocalStorageService from 'services/LocalStorageService';
import { AuthResponse } from 'types/types';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  no-param-reassign */
type AxiosConfig = InternalAxiosRequestConfig<any> & { isRetry: boolean };

const api = axios.create({
  withCredentials: true,
  baseURL: SERVER_PROPS.URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('golf-token')}`;
  return config;
});

api.interceptors.response.use(
  (config) => config,
  async (error: AxiosError) => {
    const originalRequest: InternalAxiosRequestConfig<any> | undefined | AxiosConfig = error.config;
    if (
      error.response?.status === 401
      && originalRequest
      && (originalRequest as AxiosConfig).isRetry !== true
    ) {
      try {
        const newConfig = Object.assign(originalRequest, { _isRetry: true });
        const response = await axios.get<AuthResponse>(`${SERVER_PROPS.URL}/auth/refresh`, {
          withCredentials: true,
        });
        LocalStorageService.setAccessToken(response.data.accessToken);
        api.request(newConfig);
      } catch {
        console.log('Unauthorized');
      }
    }
    throw error;
  },
);
/* eslint-enable  no-param-reassign */
/* eslint-enable  @typescript-eslint/no-explicit-any */

export default api;
