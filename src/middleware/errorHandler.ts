import { Request, Response, NextFunction } from "express"

// Constants
import { httpErrors, HttpStatusNames } from "@constants/errors/httpErrors"

// Utils
import { HttpError } from "@utils/errorHelper"

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response<HttpError>,
  next: NextFunction
): void => {
  // Delegate to the default Express error handler
  // if the headers have already been sent
  if (res.headersSent) return next(err)

  const errName = err.name as HttpStatusNames

  if (err instanceof HttpError) {
    res.status(httpErrors[errName].status).json(err)
    return next(err)
  }

  const internalServerError = {
    success: false,
    name: httpErrors.InternalServerError.name,
    message: httpErrors.InternalServerError.message,
  }

  res.status(httpErrors.InternalServerError.status).json(internalServerError)
  next(new HttpError("InternalServerError"))
}
