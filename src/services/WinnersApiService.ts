import { AxiosResponse } from 'axios';
import api from 'axios/axios';
import { WinnersResponse } from 'types/types';

export default class WinnerApiService {
  static async getWinners(): Promise<AxiosResponse<WinnersResponse>> {
    return api.get<WinnersResponse>('/winners');
  }
}
