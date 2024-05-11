import { Request, NextFunction } from "express"

// Types
import { isApiError } from "@ts/typeGuards"
import { Params, ResBody, IPaginationData, ApiResponse } from "@ts/api"
import { IQuoteData } from "@ts/data/quotes"

// Utils
import { HttpError } from "@utils/errorHelper"

// Models
import * as QuotesModel from "@models/quotesModel"

// Requests
type QuotesCreateRequest = Request<
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
export type QuotesListResponse = ApiResponse<IQuoteData[], IPaginationData>
export type QuotesCreateResponse = ApiResponse<{ id: string }>
export type QuotesGetByIdResponse = ApiResponse<IQuoteData>
export type QuotesDeleteByIdResponse = ApiResponse<void>

// Setup
const DEFAULT_RECORDS_PER_PAGE = "10"
const DEFAULT_PAGE_NUMBER = "1"

/**
 * ?: Why explicit return at the end of functions?
 *
 * Because otherwise TypeScript doesn't check the return values
 * making it more or less useless validating the promise.
 */
export const list = async (
  req: Request,
  res: QuotesListResponse,
  next: NextFunction
): Promise<QuotesListResponse | void> => {
  const {
    limit = DEFAULT_RECORDS_PER_PAGE,
    page = DEFAULT_PAGE_NUMBER,
  } = req.query

  // Check if string
  if (typeof limit !== "string" || typeof page !== "string") {
    return next(
      new HttpError("BadRequest", "Query params must to be of type string.")
    )
  }

  // Coerce to numbers
  const parsedLimit = parseInt(limit, 10)
  const parsedPage = parseInt(page, 10)

  // Exclude NaN
  if (Number.isNaN(parsedLimit) || Number.isNaN(parsedPage)) {
    return next(
      new HttpError(
        "BadRequest",
        "Query params must be convertible to numbers."
      )
    )
  }

  const payload = await QuotesModel.list({
    limit: parsedLimit,
    page: parsedPage,
  })

  if (payload instanceof HttpError) {
    return next(new HttpError("BadGateway", "Could not list quotes."))
  }

  if (!payload || !payload.data) {
    return next(new HttpError("BadGateway", "Could not list quotes."))
  }

  return res.status(200).json({
    ...payload,
    success: true,
  })
}

export const create = async (
  req: QuotesCreateRequest,
  res: QuotesCreateResponse,
  next: NextFunction
): Promise<QuotesCreateResponse | void> => {
  const { author, text } = req.body

  const payload = await QuotesModel.create({
    author,
    text,
  })

  if (isApiError(payload)) {
    return next(new HttpError("BadGateway", "Could not create quote."))
  }

  if (!payload || !payload.data) {
    return next(new HttpError("BadGateway", "Could not return new quote ID."))
  }

  return res.status(201).json({
    ...payload,
    success: true,
    message: `Quote added with ID ${payload.data.id}`,
  })
}

export const getById = async (
  req: QuotesGetByIdRequest,
  res: QuotesGetByIdResponse,
  next: NextFunction
): Promise<QuotesGetByIdResponse | void> => {
  const { id } = req.params

  const payload = await QuotesModel.getById({
    id,
  })

  if (!payload) {
    return next(new HttpError("NotFound", "Could not get quote by ID."))
  }

  return res.status(200).json({
    ...payload,
    success: true,
  })
}

export const deleteById = async (
  req: QuotesDeleteByIdRequest,
  res: QuotesDeleteByIdResponse
): Promise<QuotesDeleteByIdResponse | void> => {
  const { id } = req.params

  await QuotesModel.deleteById({
    id,
  })

  return res.status(204).json({
    success: true,
    message: `Quote deleted with ID ${id}`,
  })
}
