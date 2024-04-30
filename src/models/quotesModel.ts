import { QueryResult } from "pg"

// Types
import {
  HttpStatusCodes,
  ApiPromise,
  IPaginationData,
  IPaginationQueryResult,
} from "@ts/api"
import { IQuoteData } from "@ts/data/quotes"

// Utils
import { pool } from "@utils/dbHelper"

// Constants
import { httpStatusMessages } from "@constants/http"

// Queries
export interface IQuotesListQueryResult extends QueryResult {
  rows: IQuoteData[]
}

export interface IQuotesCreateQueryResult extends QueryResult {
  rows: {
    id: number
  }[]
}

export interface IQuotesGetByIdQueryResult extends QueryResult {
  rows: IQuoteData[]
}

export interface IQuotesDeleteByIdQueryResult extends QueryResult {
  rows: IQuoteData[]
}

// Results
export type QuotesListResponse = ApiPromise<IQuoteData[], IPaginationData>
export type QuotesCreateResponse = ApiPromise<{
  id: string
}>
export type QuotesGetByIdResponse = ApiPromise<IQuoteData>
export type QuotesDeleteByIdResponse = ApiPromise

// Setup
const MIN_LIMIT_RECORDS_PER_PAGE = 2
const MAX_LIMIT_RECORDS_PER_PAGE = 100
const MIN_CURRENT_PAGE = 1

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
/**
 *
 * @param limit - The amount of records to be fetched from the DB.
 * @param page - The index of the groupd of records being requested.
 */
export const list = async ({
  limit,
  page,
}: {
  limit: number
  page: number
}): Promise<QuotesListResponse> => {
  try {
    // Pagination
    const countRes: IPaginationQueryResult = await pool.query(
      `
      SELECT count(*) FROM quotes;
      `
    )

    const totalRecords = countRes.rows[0].count
    const totalPages = Math.ceil(totalRecords / limit)

    const nextPage = page >= totalPages ? null : page + 1
    const prevPage = page <= MIN_CURRENT_PAGE ? null : page - 1

    /**
     * As pagination only makes sense when fetching multiple items,
     * "limit" must be constrained between 2 and an arbitrary max (i.e. 100).
     */

    if (
      limit < MIN_LIMIT_RECORDS_PER_PAGE ||
      limit > MAX_LIMIT_RECORDS_PER_PAGE
    ) {
      return Promise.reject({
        success: false,
        status: 400,
        code: HttpStatusCodes.BadRequest,
        message: `Query param 'limit' is out of bounds (min ${MIN_LIMIT_RECORDS_PER_PAGE}, max ${MAX_LIMIT_RECORDS_PER_PAGE}).`,
      })
    }

    /**
     * To ensure the page does not become negative, the "pageNumber" should
     * have a minimum value of 1.
     */
    if (page < MIN_CURRENT_PAGE || page > totalPages) {
      return Promise.reject({
        success: false,
        status: 400,
        code: HttpStatusCodes.BadRequest,
        message: `Query param 'page' is out of bounds (min ${MIN_CURRENT_PAGE}, max ${totalPages}).`,
      })
    }

    // Data
    const dataRes: IQuotesListQueryResult = await pool.query(
      `
      SELECT * FROM quotes
      ORDER BY id
      LIMIT $1
      OFFSET ($2 - 1) * $1;
      `,
      [limit, page]
    )

    const paginationData: IPaginationData = {
      totalRecords,
      totalPages,
      currentPage: page,
      nextPage,
      prevPage,
    }

    return Promise.resolve({
      success: true,
      status: 204,
      data: dataRes.rows,
      pagination: paginationData,
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
