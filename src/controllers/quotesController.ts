import { Request, NextFunction } from "express"

// Types
import { isApiError } from "@ts/typeGuards"
import { HttpStatusCodes, Params, ResBody, IApiResponse } from "../types/api"
import { IQuoteData } from "@ts/data/quotes"

// Constants
import { httpStatusMessages } from "@constants/http"

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
): Promise<IQuotesListResponse> => {
  try {
    const payload = await QuotesModel.list()

    if (isApiError(payload)) {
      throw new Error("Could not list quotes.")
    }

    return res.status(200).json({
      success: true,
      status: 200,
      data: payload.data,
    })
  } catch (err) {
    if (err.status && err.code && err.message) {
      next(new Error(err.message))

      return res.status(err.status).json(err)
    }

    next(new Error(httpStatusMessages[500].internalError))

    return res.status(500).json({
      success: false,
      status: 500,
      code: HttpStatusCodes.InternalError,
      message: httpStatusMessages[500].internalError,
    })
  }
}

export const create = async (
  req: IQuotesCreateRequest,
  res: IQuotesCreateResponse,
  next: NextFunction
): Promise<IQuotesCreateResponse> => {
  const { author, text } = req.body

  try {
    const payload = await QuotesModel.create({
      author,
      text,
    })

    if (isApiError(payload)) {
      throw new Error("Could not create quote.")
    }

    if (!payload.data) {
      throw new Error(httpStatusMessages[500].internalError)
    }

    return res.status(201).json({
      success: true,
      status: 201,
      data: payload.data,
      message: `Quote added with ID ${payload.data.id}`,
    })
  } catch (err) {
    if (err.status && err.code && err.message) {
      next(new Error(err.message))

      return res.status(err.status).json(err)
    }

    next(new Error(httpStatusMessages[500].internalError))

    return res.status(500).json({
      success: false,
      status: 500,
      code: HttpStatusCodes.InternalError,
      message: httpStatusMessages[500].internalError,
    })
  }
}

export const getById = async (
  req: IQuotesGetByIdRequest,
  res: IQuotesGetByIdResponse,
  next: NextFunction
): Promise<IQuotesGetByIdResponse> => {
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
      throw new Error("Could not get quote by id.")
    }

    return res.status(200).json({
      success: true,
      status: 200,
      data: payload.data,
    })
  } catch (err) {
    if (err.status && err.code && err.message) {
      next(new Error(err.message))

      return res.status(err.status).json(err)
    }

    next(new Error(httpStatusMessages[500].internalError))

    return res.status(500).json({
      success: false,
      status: 500,
      code: HttpStatusCodes.InternalError,
      message: httpStatusMessages[500].internalError,
    })
  }
}

export const deleteById = async (
  req: IQuotesDeleteByIdRequest,
  res: IQuotesDeleteByIdResponse,
  next: NextFunction
): Promise<IQuotesDeleteByIdResponse> => {
  const { id } = req.params

  try {
    const payload = await QuotesModel.deleteById({
      id,
    })

    if (isApiError(payload)) {
      throw new Error("Could not delete quote.")
    }

    return res.status(204).json({
      success: true,
      status: 204,
      message: `Quote deleted with ID ${id}`,
    })
  } catch (err) {
    if (err.status && err.code && err.message) {
      next(new Error(err.message))

      return res.status(err.status).json(err)
    }

    next(new Error(httpStatusMessages[500].internalError))

    return res.status(500).json({
      success: false,
      status: 500,
      code: HttpStatusCodes.InternalError,
      message: httpStatusMessages[500].internalError,
    })
  }
}
