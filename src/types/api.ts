import { Response } from "express"

export enum EHttpStatusCodes {
  BadRequest = "badRequest",
  Invalid = "invalid",
  ParseError = "parseError",
  Required = "required",
  UnknownApi = "unknownApi",
  NotFound = "notFound",
  InternalError = "internalError",
}

export interface IApiSuccess<T> {
  success: boolean
  data: T
}

export interface IApiError {
  success: boolean
  code: EHttpStatusCodes
  message: string
}

export type IApiResponse<T> = Response<IApiSuccess<T> | IApiError>
