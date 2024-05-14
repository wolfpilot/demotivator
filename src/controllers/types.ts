import { Request, NextFunction } from "express"

// Types
import { Params, ResBody, ReqBody, PaginationData, ApiResponse } from "@ts/api"
import { QuoteData } from "@ts/data/quotes"

// Requests
export type QuotesListRequest = Request<
  Params,
  ResBody,
  ReqBody,
  {
    limit?: string
    page?: string
  }
>

export type QuotesCreateRequest = Request<
  Params,
  ResBody,
  {
    author?: string
    text: string
  }
>

export type QuotesGetByIdRequest = Request<{
  id: string
}>

export type QuotesDeleteByIdRequest = Request<{
  id: string
}>

// Responses
export type QuotesListResponse = ApiResponse<QuoteData[], PaginationData>
export type QuotesCreateResponse = ApiResponse<number>
export type QuotesGetByIdResponse = ApiResponse<QuoteData>
export type QuotesDeleteByIdResponse = ApiResponse<void>

// Controllers
export type ControllerList = (
  req: QuotesListRequest,
  res: QuotesListResponse,
  next: NextFunction
) => Promise<QuotesListResponse | void>

export type ControllerCreate = (
  req: QuotesCreateRequest,
  res: QuotesCreateResponse,
  next: NextFunction
) => Promise<QuotesCreateResponse | void>

export type ControllerGetById = (
  req: QuotesGetByIdRequest,
  res: QuotesGetByIdResponse,
  next: NextFunction
) => Promise<QuotesGetByIdResponse | void>

export type ControllerDeleteById = (
  req: QuotesDeleteByIdRequest,
  res: QuotesDeleteByIdResponse,
  next: NextFunction
) => Promise<QuotesDeleteByIdResponse | void>
