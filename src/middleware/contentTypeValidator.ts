import { Request, Response, NextFunction } from "express"

// Utils
import { HttpError } from "@utils/errorHelper"

export const contentTypeValidator = (type: string) => (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.is(type)) return next()

  next(new HttpError("UnsupportedMediaType"))
}
