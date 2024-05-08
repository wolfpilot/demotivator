import { Request, NextFunction } from "express"

// Types
import { isApiError } from "@ts/typeGuards"
import {
  HttpStatusCodes,
  Params,
  ResBody,
  IPaginationData,
  ApiResponse,
} from "@ts/api"
import { IQuoteData } from "@ts/data/quotes"

// Constants
import { httpStatusMessages } from "@constants/http"

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
export type QuotesCreateResponse = ApiResponse<{
  id: string
}>
export type QuotesGetByIdResponse = ApiResponse<IQuoteData>
export type QuotesDeleteByIdResponse = ApiResponse<string>

// Setup
const DEFAULT_RECORDS_PER_PAGE = "10"
const DEFAULT_PAGE_NUMBER = "1"

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
      new HttpError({
        status: 400,
        code: HttpStatusCodes.BadRequest,
        message: "Query params must to be of type string.",
      })
    )
  }

  // Coerce to numbers
  const parsedLimit = parseInt(limit, 10)
  const parsedPage = parseInt(page, 10)

  // Exclude NaN
  if (Number.isNaN(parsedLimit) || Number.isNaN(parsedPage)) {
    return next(
      new HttpError({
        status: 400,
        code: HttpStatusCodes.BadRequest,
        message: "Query params must be convertible to numbers.",
      })
    )
  }

  const payload = await QuotesModel.list({
    limit: parsedLimit,
    page: parsedPage,
  })

  if (isApiError(payload)) {
    return next(
      new HttpError({
        message: "Could not list quotes.",
      })
    )
  }

  res.status(200).json({
    success: true,
    status: 200,
    data: payload.data,
    pagination: payload?.pagination,
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
    return next(
      new HttpError({
        message: "Could not create quote.",
      })
    )
  }

  if (!payload.data) {
    return next(
      new HttpError({
        message: "Could not return new quote ID.",
      })
    )
  }

  res.status(201).json({
    success: true,
    status: 201,
    data: payload.data,
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
    return res.status(404).json({
      success: false,
      status: 404,
      code: HttpStatusCodes.NotFound,
      message: httpStatusMessages[404].notFound,
    })
  }

  if (isApiError(payload)) {
    return next(
      new HttpError({
        message: "Could not get quote by ID.",
      })
    )
  }

  res.status(200).json({
    success: true,
    status: 200,
    data: payload.data,
  })
}

export const deleteById = async (
  req: QuotesDeleteByIdRequest,
  res: QuotesDeleteByIdResponse,
  next: NextFunction
): Promise<QuotesDeleteByIdResponse | void> => {
  const { id } = req.params

  const payload = await QuotesModel.deleteById({
    id,
  })

  if (isApiError(payload)) {
    return next(
      new HttpError({
        message: "Could not delete quote by ID.",
      })
    )
  }

  res.status(204).json({
    success: true,
    status: 204,
    message: `Quote deleted with ID ${id}`,
  })
}
