import { AxiosResponse } from 'axios';
import api from 'client/axios/axios';
import { Maps } from 'common/types/types';

export default class MapsApiService {
  static async getMaps(): Promise<AxiosResponse<Maps>> {
    return api.get<Maps>('/maps');
  }

  static async updateMaps(maps: Maps): Promise<AxiosResponse<Maps>> {
    return api.put<Maps>('/maps', { maps });
  }

  static async createMaps(maps: Maps): Promise<AxiosResponse<Maps>> {
    return api.post<Maps>('/maps', { maps });
  }
}
