import { Request } from "express"
import { QueryResult } from "pg"

// Types
import { HttpStatusCodes, Params, ResBody, IApiResponse } from "../../types/api"

// Utils
import { pool } from "../../utils/dbHelper"

// Constants
import { httpStatusMessages } from "../../constants/http"

export interface IQuoteData {
  id: number
  author?: string
  text: string
}

// List all quotes
export interface IQuotesListQueryResult<T = IQuoteData> extends QueryResult {
  rows: T[]
}

export type IQuotesListResponse = IApiResponse<IQuoteData[]>

// Create single quote
export interface IQuotesCreateQueryResult extends QueryResult {
  rows: {
    id: number
  }[]
}

type IQuotesCreateRequest = Request<
  Params,
  ResBody,
  {
    author?: string
    text: string
  }
>

export type IQuotesCreateResponse = IApiResponse<string>

// Get single quote by id
export interface IQuotesGetByIdQueryResult<T = IQuoteData> extends QueryResult {
  rows: T[]
}

export type IQuotesGetByIdRequest = Request<{
  id: string
}>

export type IQuotesGetByIdResponse = IApiResponse<IQuoteData>

export const list = async (
  _req: Request,
  res: IQuotesListResponse
): Promise<IQuotesListResponse> => {
  try {
    const data: IQuotesListQueryResult = await pool.query(
      `
      SELECT * FROM quotes;
      `
    )

    return res.status(200).json({
      success: true,
      data: data.rows,
    })
  } catch (err) {
    console.error(err.message, err.stack)

    return res.status(500).json({
      success: false,
      code: HttpStatusCodes.InternalError,
      message: err.message,
    })
  }
}

export const create = async (
  req: IQuotesCreateRequest,
  res: IQuotesCreateResponse
): Promise<IQuotesCreateResponse> => {
  const { author, text } = req.body

  try {
    const data: IQuotesCreateQueryResult = await pool.query(
      `
      INSERT INTO quotes (author, text)
      VALUES ($1, $2)
      RETURNING id;
      `,
      [author, text]
    )

    return res.status(201).json({
      success: true,
      message: `Quote added with ID ${data.rows[0].id}`,
    })
  } catch (err) {
    console.error(err.message, err.stack)

    return res.status(500).json({
      success: false,
      code: HttpStatusCodes.InternalError,
      message: err.message,
    })
  }
}

export const getById = async (
  req: IQuotesGetByIdRequest,
  res: IQuotesGetByIdResponse
): Promise<IQuotesGetByIdResponse> => {
  const { id } = req.params

  // TODO: How to coerce to number using validator middleware?
  const idNum = parseInt(id, 10)

  if (idNum < 1) {
    return res.status(400).json({
      success: false,
      code: HttpStatusCodes.BadRequest,
      message: httpStatusMessages[400].badRequest,
    })
  }

  try {
    const data: IQuotesGetByIdQueryResult = await pool.query(
      `
      SELECT * FROM quotes
      WHERE id = $1;
      `,
      [id]
    )

    if (!data.rows || !data.rows.length) {
      return res.status(404).json({
        success: false,
        code: HttpStatusCodes.NotFound,
        message: httpStatusMessages[404].notFound,
      })
    }

    return res.status(200).json({
      success: true,
      data: data.rows[0],
    })
  } catch (err) {
    console.error(err.message, err.stack)

    return res.status(500).json({
      success: false,
      code: HttpStatusCodes.InternalError,
      message: err.message,
    })
  }
}
