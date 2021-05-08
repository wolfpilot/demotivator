import { Request, NextFunction } from "express"

// Types
import { isApiError } from "@ts/typeGuards"
import { HttpStatusCodes, Params, ResBody, ApiResponse } from "@ts/api"
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
export type QuotesListResponse = ApiResponse<IQuoteData[]>
export type QuotesCreateResponse = ApiResponse<{
  id: string
}>
export type QuotesGetByIdResponse = ApiResponse<IQuoteData>
export type QuotesDeleteByIdResponse = ApiResponse<string>

export const list = async (
  _req: Request,
  res: QuotesListResponse,
  next: NextFunction
): Promise<QuotesListResponse | void> => {
  try {
    const payload = await QuotesModel.list()

    if (isApiError(payload)) {
      return next(
        new HttpError({
          message: "Could not list quotes.",
        })
      )
    }

    return res.status(200).json({
      success: true,
      status: 200,
      data: payload.data,
    })
  } catch (err) {
    next(err)
  }
}

export const create = async (
  req: QuotesCreateRequest,
  res: QuotesCreateResponse,
  next: NextFunction
): Promise<QuotesCreateResponse | void> => {
  const { author, text } = req.body

  try {
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

    return res.status(201).json({
      success: true,
      status: 201,
      data: payload.data,
      message: `Quote added with ID ${payload.data.id}`,
    })
  } catch (err) {
    next(err)
  }
}

export const getById = async (
  req: QuotesGetByIdRequest,
  res: QuotesGetByIdResponse,
  next: NextFunction
): Promise<QuotesGetByIdResponse | void> => {
  const { id } = req.params

  try {
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

    return res.status(200).json({
      success: true,
      status: 200,
      data: payload.data,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteById = async (
  req: QuotesDeleteByIdRequest,
  res: QuotesDeleteByIdResponse,
  next: NextFunction
): Promise<QuotesDeleteByIdResponse | void> => {
  const { id } = req.params

  try {
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

    return res.status(204).json({
      success: true,
      status: 204,
      message: `Quote deleted with ID ${id}`,
    })
  } catch (err) {
    next(err)
  }
}
