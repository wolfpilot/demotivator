import * as core from "express-serve-static-core"
import { Response } from "express"
import { QueryResult } from "pg"

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
  // 520
  UnknownError = "unknownError",
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

export interface IPaginationQueryResult extends QueryResult {
  rows: {
    count: number
  }[]
}

export interface IPaginationData {
  totalRecords: number
  totalPages: number
  currentPage: number
  nextPage: number | null
  prevPage: number | null
}

// API Status
export interface IApiSuccess<T, K> {
  success: boolean
  status: number
  data?: T
  pagination?: K
  message?: string
}

export interface IApiError {
  success: boolean
  status: number
  code: HttpStatusCodes
  message: string
}

export type ApiPromise<T = void, K = void> = Promise<
  IApiSuccess<T, K> | IApiError
>
export type ApiResponse<T = void, K = void> = Response<
  IApiSuccess<T, K> | IApiError
>
