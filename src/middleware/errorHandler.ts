import { Request, Response, NextFunction } from "express"

// Types
import { HttpStatusCodes, IApiError } from "@ts/api"

// Constants
import { httpStatusMessages } from "@constants/http"

// Utils
import { HttpError } from "@utils/errorHelper"

export const errorHandler = (
  err: IApiError,
  _req: Request,
  res: Response<IApiError>,
  next: NextFunction
): void => {
  // Delegate to the default Express error handler
  // if the headers have already been sent
  if (res.headersSent) return next(err)

  const { status, code, message } = err

  if (status && code && message) {
    res.status(status).json({
      success: false,
      status,
      code,
      message,
    })

    return next(new HttpError(err))
  }

  res.status(500).json({
    success: false,
    status: 500,
    code: HttpStatusCodes.InternalError,
    message: httpStatusMessages[500].internalError,
  })

  next(
    new HttpError({
      status: 500,
      code: HttpStatusCodes.InternalError,
      message: httpStatusMessages[500].internalError,
    })
  )
}
