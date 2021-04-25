import { Request, Response } from "express"
import { QueryResult } from "pg"

// Utils
import { pool } from "../../utils/dbHelper"

// Constants
import { httpStatusCodes } from "../../constants/httpStatusCodes"

export interface IQuoteData {
  id: number
  author?: string
  text: string
}

// List all quotes
export interface IQuotesListQueryResult<T = IQuoteData> extends QueryResult {
  rows: T[]
}

export type IQuotesListResponse = Response<{
  success: boolean
  data?: IQuoteData[]
  error?: string
}>

// Get single quote by id
export interface IQuotesGetByIdQueryResult<T = IQuoteData> extends QueryResult {
  rows: T[]
}

export type IQuotesGetByIdRequest = Request<{
  id: string
}>

export type IQuotesGetByIdResponse = Response<{
  success: boolean
  data?: IQuoteData
  error?: string
}>

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
      error: err.message,
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
      error: httpStatusCodes[400].required,
    })
  }

  const idNum = parseInt(id, 10)

  if (isNaN(idNum)) {
    return res.status(400).json({
      success: false,
      error: httpStatusCodes[400].invalid,
    })
  }

  if (idNum < 1) {
    return res.status(400).json({
      success: false,
      error: httpStatusCodes[400].badRequest,
    })
  }

  const text = "SELECT * FROM quotes WHERE id = $1;"
  const values = [id]

  try {
    const data: IQuotesGetByIdQueryResult = await pool.query(text, values)

    if (!data.rows || !data.rows.length) {
      return res.status(404).json({
        success: false,
        error: httpStatusCodes[404].notFound,
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
      error: err.message,
    })
  }
}
