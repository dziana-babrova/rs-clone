import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';

/* eslint-disable  @typescript-eslint/no-unused-vars */
export default function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);
  if (err instanceof ApiError) {
    if (err.errors.length) {
      return res.status(err.status).json({
        message: err.message,
        errors: err.errors,
      });
    }
    return res.status(err.status).json({
      message: err.message,
    });
  }
  return res.status(500).json({ message: 'Unexpected error', errors: err.message });
}
