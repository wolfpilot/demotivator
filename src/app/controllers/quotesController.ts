import { Request, Response } from "express"
import { QueryResult } from "pg"

// Utils
import { pool } from "../../utils/dbHelper"

export interface IQuoteData {
  id: number
  author?: string
  text: string
}

export interface IQuotesListQueryResult<T = IQuoteData> extends QueryResult {
  rows: T[]
}

export type IQuotesListResponse = Response<{
  success: boolean
  data?: IQuoteData[]
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

export const create = (_req: any, _res: any) => {
  console.log("Create quote")
}

export const getById = async (_req: any, _res: any) => {
  console.log("Get quote by id")
}

export const deleteById = (_req: any, _res: any) => {
  console.log("Delete quote by id")
}
