export const VALIDATION_ERROR_NAME = "ValidationError"

export enum ValidationErrorReasons {
  InvalidParameter = "InvalidParameter",
  OutOfBounds = "OutOfBounds",
  Unhandled = "Unhandled",
}

export interface ValidationError {
  reason: ValidationErrorReasons
  message: string
}

export type ValidationErrors = Record<
  keyof typeof ValidationErrorReasons,
  ValidationError
>

export const validationErrors: ValidationErrors = {
  InvalidParameter: {
    reason: ValidationErrorReasons.InvalidParameter,
    message:
      "The request failed because it contained an invalid parameter or parameter value. Review the API documentation to determine which parameters are valid for your request.",
  },
  OutOfBounds: {
    reason: ValidationErrorReasons.OutOfBounds,
    message:
      "The request failed because it contained a parameter value that is not within the specified boundaries. Review the API documentation to determine which parameters are valid for your request.",
  },
  Unhandled: {
    reason: ValidationErrorReasons.Unhandled,
    message:
      "The API request is invalid or improperly formed. Consequently, the API server could not understand the request.",
  },
}
