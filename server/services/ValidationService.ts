import { Result, ValidationError } from 'express-validator';
import { ApiError } from '../errors/ApiError';

class ValidationService {
  handleValidationResult(validationResult: Result<ValidationError>) {
    if (!validationResult.isEmpty()) {
      throw ApiError.BadRequest('Validation error', validationResult.array());
    }
  }
}

export default new ValidationService();
