import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { serverProps } from 'client/const/AppConstants';
import LocalStorageService from 'client/services/LocalStorageService';
import { AuthResponse } from 'common/types/types';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  no-param-reassign */
type AxiosConfig = InternalAxiosRequestConfig<any> & { isRetry: boolean };

const api = axios.create({
  withCredentials: true,
  baseURL: serverProps.URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${LocalStorageService.getAccessToken()}`;
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
        const response = await axios.get<AuthResponse>(`${serverProps.URL}/auth/refresh`, {
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
