import { Request, NextFunction } from "express"

// Types
import { isApiError } from "@ts/typeGuards"
import { HttpStatusCodes, Params, ResBody, IApiResponse } from "@ts/api"
import { IQuoteData } from "@ts/data/quotes"

// Constants
import { httpStatusMessages } from "@constants/http"

// Utils
import { HttpError } from "@utils/errorHelper"

// Models
import * as QuotesModel from "@models/quotesModel"

// Requests
type IQuotesCreateRequest = Request<
  Params,
  ResBody,
  {
    author?: string
    text: string
  }
>

export type IQuotesGetByIdRequest = Request<{
  id: string
}>

export type IQuotesDeleteByIdRequest = Request<{
  id: string
}>

// Responses
export type IQuotesListResponse = IApiResponse<IQuoteData[]>
export type IQuotesCreateResponse = IApiResponse<{
  id: string
}>
export type IQuotesGetByIdResponse = IApiResponse<IQuoteData>
export type IQuotesDeleteByIdResponse = IApiResponse<string>

export const list = async (
  _req: Request,
  res: IQuotesListResponse,
  next: NextFunction
): Promise<IQuotesListResponse | void> => {
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
  req: IQuotesCreateRequest,
  res: IQuotesCreateResponse,
  next: NextFunction
): Promise<IQuotesCreateResponse | void> => {
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
  req: IQuotesGetByIdRequest,
  res: IQuotesGetByIdResponse,
  next: NextFunction
): Promise<IQuotesGetByIdResponse | void> => {
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
  req: IQuotesDeleteByIdRequest,
  res: IQuotesDeleteByIdResponse,
  next: NextFunction
): Promise<IQuotesDeleteByIdResponse | void> => {
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
