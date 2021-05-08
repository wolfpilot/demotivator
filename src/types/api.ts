import * as core from "express-serve-static-core"
import { Response } from "express"

export enum HttpStatusCodes {
  // 400
  BadRequest = "badRequest",
  Invalid = "invalid",
  ParseError = "parseError",
  Required = "required",
  UnknownApi = "unknownApi",
  // 404
  NotFound = "notFound",
  // 409
  Conflict = "conflict",
  Duplicate = "duplicate",
  // 415
  UnsupportedMediaType = "unsupportedMediaType",
  // 500
  InternalError = "internalError",
  // 503
  BackendError = "backendError",
  BackendNotConnected = "backendNotConnected",
  NotReady = "notReady",
}

/**
 * Re-export Express Request generics for easier extension.
 *
 * Example usage for custom request body:
 *
 * type QuotesCreateRequest = Request<
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
  status: number
  data?: T
  message?: string
}

export interface IApiError {
  success: boolean
  status: number
  code: HttpStatusCodes
  message: string
}

export type ApiPromise<T = void> = Promise<IApiSuccess<T> | IApiError>
export type ApiResponse<T = void> = Response<IApiSuccess<T> | IApiError>
