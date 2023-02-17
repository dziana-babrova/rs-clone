import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import ValidationService from '../services/ValidationService';

/* eslint consistent-return: 0 */
export default class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      ValidationService.handleValidationResult(errors);
      const { email, username, password } = req.body;
      const data = await UserService.sigUp(email, username, password);
      res.cookie('refreshToken', data.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      ValidationService.handleValidationResult(errors);
      const { email, password } = req.body;
      const data = await UserService.signIn(email, password);
      res.cookie('refreshToken', data.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      ValidationService.handleValidationResult(errors);
      const { refreshToken } = req.cookies;
      await UserService.signOut(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).end();
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const data = await UserService.refresh(refreshToken);
      res.cookie('refreshToken', data.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }
}
