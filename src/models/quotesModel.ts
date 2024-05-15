// Types
import { ModelError } from "@ts/api"
import {
  ModelGetTotalRecords,
  ModelGetByPage,
  ModelCreate,
  ModelGetById,
  ModelDeleteById,
  QuotesGetTotalRecordsQueryResult,
  QuotesGetByPageQueryResult,
  QuotesCreateQueryResult,
  QuotesGetByIdQueryResult,
  QuotesDeleteByIdQueryResult,
} from "./types"

// Utils
import { isRenderHost } from "@utils/envHelper"
import { pool } from "@utils/dbHelper"
import { ValidationError, ServiceError } from "@utils/errorHelper"

// Setup

/**
 * As opposed to other DB programming languages, SQL indexes always start at 1.
 * We can use this simple check to avoid unnecessary DB queries.
 *
 * @see https://stackoverflow.com/questions/53631015/why-sql-primary-key-index-begin-at-1-and-not-at-0
 */
const MIN_SQL_RECORD_INDEX = 1

// Utils
const parseError = (err: unknown): Promise<ModelError> => {
  /**
   * console.log() is synchronous and can slow down or even freeze servers
   * if the stack is too long. It's best to disable it on production
   * or use some async library.
   *
   * @see https://dev.to/adam_cyclones/consolelog-is-slow-2a2b
   */
  if (err instanceof Error && !isRenderHost) {
    console.error(err.message, err.stack)
  }

  /**
   * Additionally, here we can handle 3rd-party API errors such as PostgresQL:
   *
   * if (err instanceof Error) {
   *   if (err.code === 24000) {
   *     ... // Manually reset cursor
   *   }
   * }
   *
   * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
   */

  return Promise.reject(err)
}

// Functions
export const getTotalRecords: ModelGetTotalRecords = async () => {
  try {
    const res: QuotesGetTotalRecordsQueryResult = await pool.query(
      `
      SELECT count(*) FROM quotes;
      `
    )

    const totalRecords = res.rows[0].count

    return Promise.resolve({
      data: totalRecords,
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const getByPage: ModelGetByPage = async ({ limit, page }) => {
  try {
    const res: QuotesGetByPageQueryResult = await pool.query(
      `
      SELECT * FROM quotes
      ORDER BY id
      LIMIT $1
      OFFSET ($2 - 1) * $1;
      `,
      [limit, page]
    )

    const quotes = res.rows?.length ? res.rows : null

    return Promise.resolve({
      data: quotes,
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const create: ModelCreate = async ({ author, text }) => {
  try {
    const res: QuotesCreateQueryResult = await pool.query(
      `
      INSERT INTO quotes (author, text)
      VALUES ($1, $2)
      RETURNING id;
      `,
      [author, text]
    )

    const id = res.rows[0].id

    if (!id) {
      return Promise.reject(new ServiceError("Conflict"))
    }

    return Promise.resolve({
      data: id,
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const getById: ModelGetById = async ({ id }) => {
  if (id < MIN_SQL_RECORD_INDEX) {
    return Promise.reject(new ValidationError("InvalidParameter"))
  }

  try {
    const res: QuotesGetByIdQueryResult = await pool.query(
      `
      SELECT * FROM quotes
      WHERE id = $1;
      `,
      [id]
    )

    const quote = res.rows?.length ? res.rows[0] : null

    return Promise.resolve({ data: quote })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const deleteById: ModelDeleteById = async ({ id }) => {
  if (id < MIN_SQL_RECORD_INDEX) {
    return Promise.reject(
      new ValidationError(
        "InvalidParameter",
        `Param 'id' is out of bounds (min ${MIN_SQL_RECORD_INDEX}).`
      )
    )
  }

  try {
    const res: QuotesDeleteByIdQueryResult = await pool.query(
      `
      DELETE FROM quotes
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    )

    const isDeleted = !!res.rowCount

    return Promise.resolve({ data: isDeleted })
  } catch (err: unknown) {
    return parseError(err)
  }
}
