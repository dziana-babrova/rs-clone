import { AxiosResponse } from 'axios';
import api from 'axios/axios';
import { Maps } from 'types/types';

export default class MapsApiService {
  static async getMaps(): Promise<AxiosResponse<Maps>> {
    return api.get<Maps>('/maps');
  }

  static async updateMaps(maps: MapsApiService): Promise<AxiosResponse<Maps>> {
    return api.put<Maps>('/maps', { maps });
  }
}
