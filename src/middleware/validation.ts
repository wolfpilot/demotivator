import { Request, Response, NextFunction } from "express"
import { ValidationError } from "express-json-validator-middleware"

export const validationErrorMiddleware = (
  error: ValidationError,
  _request: Request,
  response: Response,
  next: NextFunction
): void => {
  // Delegate to the default Express error handler
  // if the headers have already been sent
  if (response.headersSent) return next(error)

  const isValidationError = error instanceof ValidationError

  // Pass error on if not a validation error
  if (!isValidationError) return next(error)

  // Handle the validation error
  response.status(400).json({
    errors: error.validationErrors,
  })

  next()
}
