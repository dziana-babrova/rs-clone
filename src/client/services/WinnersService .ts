import { AxiosError } from 'axios';
import { WinnersResponse } from 'common/types/types';
import WinnerApiService from './WinnersApiService';

export default class WinnersService {
  static async getWinners(): Promise<WinnersResponse | AxiosError> {
    try {
      const response = await WinnerApiService.getWinners();
      return response.data;
    } catch (e: unknown) {
      return (e as AxiosError);
    }
  }
}
