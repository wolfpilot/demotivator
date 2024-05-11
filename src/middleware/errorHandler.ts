import { Request, Response, NextFunction } from "express"

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

  res.status(err.status).json(err)
  next(err)
}
