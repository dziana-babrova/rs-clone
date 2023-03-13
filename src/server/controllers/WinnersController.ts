import { NextFunction, Request, Response } from 'express';
import WinnersService from '../services/WinnersService';

export default class WinnersController {
  async getWinners(req: Request, res: Response, next: NextFunction) {
    try {
      const winnersPromises = await WinnersService.getWinners();
      const winners = await Promise.all(winnersPromises);
      return res.json(winners);
    } catch (e) {
      return next(e);
    }
  }
}
