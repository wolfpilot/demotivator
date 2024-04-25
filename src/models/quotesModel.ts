import { QueryResult } from "pg"

// Types
import { HttpStatusCodes, ApiPromise } from "@ts/api"
import { IQuoteData } from "@ts/data/quotes"

// Utils
import { pool } from "@utils/dbHelper"

// Constants
import { httpStatusMessages } from "@constants/http"

// Queries
export interface IQuotesListQueryResult<T = IQuoteData> extends QueryResult {
  rows: T[]
}

export interface IQuotesCreateQueryResult extends QueryResult {
  rows: {
    id: number
  }[]
}

export interface IQuotesGetByIdQueryResult<T = IQuoteData> extends QueryResult {
  rows: T[]
}

export interface IQuotesDeleteByIdQueryResult<T = IQuoteData>
  extends QueryResult {
  rows: T[]
}

// Results
export type QuotesListResponse = ApiPromise<IQuoteData[]>
export type QuotesCreateResponse = ApiPromise<{
  id: string
}>
export type QuotesGetByIdResponse = ApiPromise<IQuoteData>
export type QuotesDeleteByIdResponse = ApiPromise

// Utils
const parseError = (err: unknown) => {
  if (err instanceof Error) {
    console.error(err.message, err.stack)

    return Promise.reject({
      success: false,
      status: 503,
      code: HttpStatusCodes.BackendError,
      message: httpStatusMessages[503].backendError,
    })
  }

  return Promise.reject({
    success: false,
    status: 520,
    code: HttpStatusCodes.UnknownError,
    message: httpStatusMessages[520].unknownError,
  })
}

// Functions
export const list = async (): Promise<QuotesListResponse> => {
  try {
    const res: IQuotesListQueryResult = await pool.query(
      `
      SELECT * FROM quotes;
      `
    )

    return Promise.resolve({
      success: true,
      status: 204,
      data: res.rows,
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const create = async ({
  author,
  text,
}: {
  author?: string
  text: string
}): Promise<QuotesCreateResponse> => {
  try {
    const res: IQuotesCreateQueryResult = await pool.query(
      `
      INSERT INTO quotes (author, text)
      VALUES ($1, $2)
      RETURNING id;
      `,
      [author, text]
    )

    const id = res.rows[0].id

    if (!id) {
      return Promise.reject({
        success: false,
        status: 409,
        code: HttpStatusCodes.Conflict,
        message: httpStatusMessages[409].conflict,
      })
    }

    return Promise.resolve({
      success: true,
      status: 204,
      data: {
        id: id.toString(),
      },
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const getById = async ({
  id,
}: {
  id: string
}): Promise<QuotesGetByIdResponse> => {
  const idNum = parseInt(id, 10)

  if (idNum < 1) {
    return Promise.reject({
      success: false,
      status: 400,
      code: HttpStatusCodes.BadRequest,
      message: httpStatusMessages[400].badRequest,
    })
  }

  try {
    const res: IQuotesGetByIdQueryResult = await pool.query(
      `
      SELECT * FROM quotes
      WHERE id = $1;
      `,
      [id]
    )

    if (!res.rows || !res.rows.length) {
      return Promise.reject({
        success: false,
        status: 404,
        code: HttpStatusCodes.NotFound,
        message: httpStatusMessages[404].notFound,
      })
    }

    return Promise.resolve({
      success: true,
      status: 204,
      data: res.rows[0],
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const deleteById = async ({
  id,
}: {
  id: string
}): Promise<QuotesDeleteByIdResponse> => {
  const idNum = parseInt(id, 10)

  if (idNum < 1) {
    return Promise.reject({
      success: false,
      status: 400,
      code: HttpStatusCodes.BadRequest,
      message: httpStatusMessages[400].badRequest,
    })
  }

  try {
    const res: IQuotesDeleteByIdQueryResult = await pool.query(
      `
      DELETE FROM quotes
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    )

    if (!res.rowCount) {
      return Promise.reject({
        success: false,
        status: 404,
        code: HttpStatusCodes.NotFound,
        message: httpStatusMessages[404].notFound,
      })
    }

    return Promise.resolve({
      success: true,
      status: 204,
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}
