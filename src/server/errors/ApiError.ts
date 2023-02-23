import { ValidationError } from 'express-validator';

export default class ApiError extends Error {
  status: number;

  errors: ValidationError[] | unknown[];

  constructor(status: number, message: string, errors: ValidationError[] | unknown[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Unauthorized');
  }

  static BadRequest(message: string, errors: ValidationError[] | unknown[] = []) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message: string) {
    return new ApiError(404, message);
  }
}
