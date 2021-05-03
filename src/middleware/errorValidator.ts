import { Request, Response, NextFunction } from "express"
import { ValidationError } from "express-json-validator-middleware"

export const errorValidator = (
  err: ValidationError,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Delegate to the default Express error handler
  // if the headers have already been sent
  if (res.headersSent) return next(err)

  const isValidationError = err instanceof ValidationError

  // Pass error on if not a validation error
  if (!isValidationError) return next(err)

  // Handle the validation error
  res.status(400).json({
    errors: err.validationErrors,
  })

  next()
}
