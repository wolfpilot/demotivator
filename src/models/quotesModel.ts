import { QueryResult } from "pg"

// Types
import { HttpStatusCodes, IApiPromise } from "../types/api"
import { IQuoteData } from "../types/data/quotes"

// Utils
import { pool } from "../utils/dbHelper"

// Constants
import { httpStatusMessages } from "../constants/http"

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
export type IQuotesListResponse = IApiPromise<IQuoteData[]>
export type IQuotesCreateResponse = IApiPromise<string>
export type IQuotesGetByIdResponse = IApiPromise<IQuoteData>
export type IQuotesDeleteByIdResponse = IApiPromise

export const list = async (): Promise<IQuotesListResponse> => {
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
  } catch (err) {
    console.error(err.message, err.stack)

    return Promise.reject({
      success: false,
      status: 503,
      code: HttpStatusCodes.BackendError,
      message: httpStatusMessages[503].backendError,
    })
  }
}

export const create = async ({
  author,
  text,
}: {
  author?: string
  text: string
}): Promise<IQuotesCreateResponse> => {
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
      data: id.toString(),
    })
  } catch (err) {
    console.error(err.message, err.stack)

    return Promise.reject({
      success: false,
      status: 503,
      code: HttpStatusCodes.BackendError,
      message: httpStatusMessages[503].backendError,
    })
  }
}

export const getById = async ({
  id,
}: {
  id: string
}): Promise<IQuotesGetByIdResponse> => {
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
  } catch (err) {
    console.error(err.message, err.stack)

    return Promise.reject({
      success: false,
      status: 503,
      code: HttpStatusCodes.BackendError,
      message: httpStatusMessages[503].backendError,
    })
  }
}

export const deleteById = async ({
  id,
}: {
  id: string
}): Promise<IQuotesDeleteByIdResponse> => {
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
  } catch (err) {
    console.error(err.message, err.stack)

    return Promise.reject({
      success: false,
      status: 503,
      code: HttpStatusCodes.BackendError,
      message: httpStatusMessages[503].backendError,
    })
  }
}
