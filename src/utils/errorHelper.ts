import { CustomError } from "ts-custom-error"

// Constants
import { HttpStatusNames, httpStatusCodes } from "@constants/http"

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
  public status: number
  public message: string

  constructor(name: keyof typeof HttpStatusNames, message?: string) {
    const code = httpStatusCodes[name]

    super()

    /**
     * Workaround for assigning the custom error name property.
     *
     * @see https://github.com/adriengibrat/ts-custom-error/issues/53#issuecomment-679403993
     */
    Object.defineProperty(this, "name", {
      value: code.name || httpStatusCodes.InternalServerError.name,
    })

    this.success = false
    this.status = code.status || httpStatusCodes.InternalServerError.status
    this.message =
      message || code.message || httpStatusCodes.InternalServerError.message
  }
}
