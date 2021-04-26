import * as core from "express-serve-static-core"
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

/**
 * Re-export Express Request generics for easier extension.
 *
 * Example usage for custom request body:
 *
 * type IQuotesCreateRequest = Request<
 *   Params,
 *   ResBody,
 *   {
 *     author?: string
 *     text: string
 *   },
 *   Query
 * >
 */
export type Params = core.ParamsDictionary
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type ResBody = any
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type ReqBody = any
export type Query = core.Query

// API Status
export interface IApiSuccess<T> {
  success: boolean
  data?: T
  message?: string
}

export interface IApiError {
  success: boolean
  code: EHttpStatusCodes
  message: string
}

export type IApiResponse<T> = Response<IApiSuccess<T> | IApiError>
