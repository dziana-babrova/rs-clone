import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';
import { RequestWithUser } from '../middleware/auth-middleware';
import MapsService from '../services/MapsService';

export default class MapsController {
  async getMaps(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as RequestWithUser;
      if (!user) {
        throw ApiError.UnauthorizedError();
      }
      const maps = await MapsService.findMaps(user.id);
      return res.json(maps);
    } catch (e) {
      return next(e);
    }
  }

  async updateMaps(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as RequestWithUser;
      if (!user) {
        throw ApiError.UnauthorizedError();
      }
      const { maps } = req.body;
      await MapsService.updateMaps(user.id, maps);
      return res.status(204).end();
    } catch (e) {
      return next(e);
    }
  }

  async createMaps(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as RequestWithUser;
      if (!user) {
        throw ApiError.UnauthorizedError();
      }
      const { maps } = req.body;
      await MapsService.createMaps(user.id, maps);
      return res.status(201).end();
    } catch (e) {
      return next(e);
    }
  }
}
