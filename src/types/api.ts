import * as core from "express-serve-static-core"
import { Response } from "express"
import { QueryResult } from "pg"

// Types
import { HttpError } from "@utils/errorHelper"

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
export type ResBody = unknown
export type ReqBody = unknown
export type Params = core.ParamsDictionary
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
export type IApiError = HttpError // | ValidationError | ...others

export interface ModelSuccess<T = void, K = void> {
  data?: T
  pagination?: K
}

export type ModelResponse<T = void, K = void> =
  | ModelSuccess<T, K>
  | IApiError
  | void

export interface IApiSuccess<T = void, K = void> extends ModelSuccess<T, K> {
  success: boolean
  message?: string
}

export type ApiResponse<T = void, K = void> = Response<IApiSuccess<T, K>>
