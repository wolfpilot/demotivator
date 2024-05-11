// Types
import { IPaginationData, IPaginationQueryResult, IApiError } from "@ts/api"
import {
  ModelList,
  ModelCreate,
  ModelGetById,
  ModelDeleteById,
  IQuotesListQueryResult,
  IQuotesCreateQueryResult,
  IQuotesGetByIdQueryResult,
  IQuotesDeleteByIdQueryResult,
} from "./types"

// Utils
import { isRenderHost } from "@utils/envHelper"
import { pool } from "@utils/dbHelper"
import { HttpError } from "@utils/errorHelper"

// Setup
const MIN_LIMIT_RECORDS_PER_PAGE = 2
const MAX_LIMIT_RECORDS_PER_PAGE = 100
const MIN_CURRENT_PAGE = 1

// Utils
const parseError = (err: unknown): Promise<IApiError> => {
  /**
   * console.log() is synchronous and can slow down or even freeze servers
   * if the stack is too long. Therefore it's best to disable it on production
   * or use some async library.
   *
   * @see https://dev.to/adam_cyclones/consolelog-is-slow-2a2b
   */
  if (err instanceof Error && !isRenderHost) {
    console.error(err.message, err.stack)
  }

  // Return known errors
  if (err instanceof HttpError) {
    return Promise.reject(err)
  }

  // Avoid potential attacks by returning generic 500 errors for DB-related issues
  return Promise.reject(new HttpError("InternalServerError"))
}

// Functions
/**
 *
 * @param limit - The amount of records to be fetched from the DB.
 * @param page - The index of the groupd of records being requested.
 */
export const list: ModelList = async ({ limit, page }) => {
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
      return Promise.reject(
        new HttpError(
          "BadRequest",
          `Query param 'limit' is out of bounds (min ${MIN_LIMIT_RECORDS_PER_PAGE}, max ${MAX_LIMIT_RECORDS_PER_PAGE}).`
        )
      )
    }

    /**
     * To ensure the page does not become negative, the "pageNumber" should
     * have a minimum value of 1.
     */
    if (page < MIN_CURRENT_PAGE || page > totalPages) {
      return Promise.reject(
        new HttpError(
          "BadRequest",
          `Query param 'page' is out of bounds (min ${MIN_CURRENT_PAGE}, max ${totalPages}).`
        )
      )
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
      data: dataRes.rows,
      pagination: paginationData,
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const create: ModelCreate = async ({ author, text }) => {
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
      return Promise.reject(new HttpError("Conflict"))
    }

    return Promise.resolve({
      data: {
        id: id.toString(),
      },
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const getById: ModelGetById = async ({ id }) => {
  const idNum = parseInt(id, 10)

  if (idNum < 1) {
    return Promise.reject(new HttpError("BadRequest"))
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
      return Promise.reject(new HttpError("NotFound"))
    }

    return Promise.resolve({
      data: res.rows[0],
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const deleteById: ModelDeleteById = async ({ id }) => {
  const idNum = parseInt(id, 10)

  if (idNum < 1) {
    return Promise.reject(new HttpError("BadRequest"))
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
      return Promise.reject(new HttpError("NotFound"))
    }

    return Promise.resolve()
  } catch (err: unknown) {
    return parseError(err)
  }
}
