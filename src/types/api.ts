import * as core from "express-serve-static-core"
import { Response } from "express"

// Types
import { HttpError, ValidationError, ServiceError } from "@utils/errorHelper"

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

export interface PaginationData {
  totalRecords: number
  totalPages: number
  currentPage: number
  nextPage: number | null
  prevPage: number | null
}

// API
export type ApiError = HttpError

export interface ApiSuccess<T = void, K = void> {
  success: boolean
  message?: string
  data?: T
  pagination?: K
}

export type ApiResponse<T = void, K = void> = Response<
  ApiSuccess<T, K> | ApiError
>

// Model
export type ModelError = ValidationError | ServiceError

export interface ModelSuccess<T> {
  data: T
}

export type ModelResponse<T> = ModelSuccess<T> | ModelError
