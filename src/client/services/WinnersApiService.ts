import { AxiosResponse } from 'axios';
import api from 'client/axios/axios';
import { WinnersResponse } from 'common/types/types';

export default class WinnerApiService {
  static async getWinners(): Promise<AxiosResponse<WinnersResponse>> {
    return api.get<WinnersResponse>('/winners');
  }
}
