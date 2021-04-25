import { Request } from "express"
import { QueryResult } from "pg"

// Types
import { EHttpStatusCodes, IApiResponse } from "../../types/api"

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
      "SELECT * FROM quotes;"
    )

    const payload = {
      success: true,
      data: data.rows,
    }

    return res.status(200).json(payload)
  } catch (err) {
    console.error(err.message, err.stack)

    return res.status(500).json({
      success: false,
      code: EHttpStatusCodes.InternalError,
      message: err.message,
    })
  }
}

export const getById = async (
  req: IQuotesGetByIdRequest,
  res: IQuotesGetByIdResponse
): Promise<IQuotesGetByIdResponse> => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      success: false,
      code: EHttpStatusCodes.Required,
      message: httpStatusMessages[400].required,
    })
  }

  const idNum = parseInt(id, 10)

  if (isNaN(idNum)) {
    return res.status(400).json({
      success: false,
      code: EHttpStatusCodes.Invalid,
      message: httpStatusMessages[400].invalid,
    })
  }

  if (idNum < 1) {
    return res.status(400).json({
      success: false,
      code: EHttpStatusCodes.BadRequest,
      message: httpStatusMessages[400].badRequest,
    })
  }

  const text = "SELECT * FROM quotes WHERE id = $1;"
  const values = [id]

  try {
    const data: IQuotesGetByIdQueryResult = await pool.query(text, values)

    if (!data.rows || !data.rows.length) {
      return res.status(404).json({
        success: false,
        code: EHttpStatusCodes.NotFound,
        message: httpStatusMessages[404].notFound,
      })
    }

    const payload = {
      success: true,
      data: data.rows[0],
    }

    return res.status(200).json(payload)
  } catch (err) {
    console.error(err.message, err.stack)

    return res.status(500).json({
      success: false,
      code: EHttpStatusCodes.InternalError,
      message: err.message,
    })
  }
}
