import { NextFunction, Request, Response } from 'express';
import UserDto from '../dto/UserDto';
import ApiError from '../errors/ApiError';
import TokenService from '../services/TokenService';

export interface RequestWithUser extends Request {
  user: UserDto;
}

/* eslint-disable  consistent-return */
export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authHeader.replace('Bearer ', '');
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const data = TokenService.validateAccessToken<UserDto>(accessToken);
    if (!data) {
      return next(ApiError.UnauthorizedError());
    }
    (req as RequestWithUser).user = data;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}
/* eslint-enable  consistent-return */
