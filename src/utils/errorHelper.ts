import { CustomError } from "ts-custom-error"

// Constants
import { HttpStatusNames, httpErrors } from "@constants/errors/httpErrors"
import {
  VALIDATION_ERROR_NAME,
  ValidationErrorReasons,
  validationErrors,
} from "@constants/errors/validationErrors"
import {
  SERVICE_ERROR_NAME,
  ServiceErrorReasons,
  serviceErrors,
} from "@constants/errors/serviceErrors"

/**
 * Default is set to 500 Internal Server Error.
 *
 * If a "name" argument is passed, new defaults will be selected from a pre-existing config
 * of status codes where the name, status and message will be populated automatically.
 *
 * However if a custom "message" argument is passed, it will instead overwrite any other default.
 */
export class HttpError extends CustomError {
  public success: boolean

  constructor(name: keyof typeof HttpStatusNames, message?: string) {
    const code = httpErrors[name]

    super()

    /**
     * Workaround for assigning the custom error name property.
     *
     * @see https://github.com/adriengibrat/ts-custom-error/issues/53#issuecomment-679403993
     */
    Object.defineProperty(this, "name", {
      value: code.name || httpErrors.InternalServerError.name,
    })

    this.success = false
    this.message =
      message || code.message || httpErrors.InternalServerError.message
  }
}

export class ValidationError extends CustomError {
  public reason: keyof typeof ValidationErrorReasons

  constructor(reason: keyof typeof ValidationErrorReasons, message?: string) {
    const errorType = validationErrors[reason]

    super()

    Object.defineProperty(this, "name", {
      value: VALIDATION_ERROR_NAME,
    })

    this.reason =
      reason || errorType.reason || validationErrors.Unhandled.reason
    this.message =
      message || errorType.message || validationErrors.Unhandled.message
  }
}

export class ServiceError extends CustomError {
  public reason: keyof typeof ServiceErrorReasons

  constructor(reason: keyof typeof ServiceErrorReasons, message?: string) {
    const errorType = serviceErrors[reason]

    super()

    Object.defineProperty(this, "name", {
      value: SERVICE_ERROR_NAME,
    })

    this.reason = reason || errorType.reason || serviceErrors.Unhandled.reason
    this.message =
      message || errorType.message || serviceErrors.Unhandled.message
  }
}
