import { CustomError } from "ts-custom-error"

// Types
import { HttpStatusCodes } from "@ts/api"

// Constants
import { httpStatusMessages } from "@constants/http"

export class HttpError extends CustomError {
  public status?: number
  public code?: HttpStatusCodes
  public message: string

  constructor(args: Partial<HttpError>) {
    const {
      status = 500,
      code = HttpStatusCodes.InternalError,
      message = httpStatusMessages[500].internalError,
    } = args

    super(message)

    this.status = status
    this.code = code
    this.message = message
  }
}
