import { Request, Response, NextFunction } from "express"

// Types
import { HttpStatusCodes } from "@ts/api"

// Constants
import { httpStatusMessages } from "@constants/http"

export const contentTypeValidator = (type: string) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.is(type)) return next()

  res.status(415).json({
    success: false,
    status: 415,
    code: HttpStatusCodes.UnsupportedMediaType,
    message: httpStatusMessages[415].unsupportedMediaType,
  })
}
