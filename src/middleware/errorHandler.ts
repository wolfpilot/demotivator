import { Request, Response, NextFunction } from "express"

// Types
import { HttpStatusCodes, IApiError } from "@ts/api"

// Constants
import { httpStatusMessages } from "@constants/http"

export const errorHandler = async (
  err: IApiError,
  _req: Request,
  res: Response<IApiError>,
  next: NextFunction
): Promise<void> => {
  const { status, code, message } = err

  if (status && code && message) {
    res.status(status).json(err)

    return next(new Error(message))
  }

  res.status(500).json({
    success: false,
    status: 500,
    code: HttpStatusCodes.InternalError,
    message: httpStatusMessages[500].internalError,
  })

  return next(new Error(httpStatusMessages[500].internalError))
}
