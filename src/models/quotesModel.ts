import { count, eq } from "drizzle-orm"

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
import { db } from "@utils/dbHelper"
import { ValidationError, ServiceError } from "@utils/errorHelper"

// Schemas
import { quotes } from "@database/schema"

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
    const res: QuotesGetTotalRecordsQueryResult = await db
      .select({ count: count() })
      .from(quotes)

    const totalRecordsData = res[0].count

    return Promise.resolve({
      data: totalRecordsData,
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const getByPage: ModelGetByPage = async ({ limit, page }) => {
  try {
    const res: QuotesGetByPageQueryResult = await db
      .select()
      .from(quotes)
      .orderBy(quotes.id)
      .limit(limit)
      .offset((page - 1) * limit)

    const quotesData = res.length ? res : null

    return Promise.resolve({
      data: quotesData,
    })
  } catch (err: unknown) {
    return parseError(err)
  }
}

export const create: ModelCreate = async ({ author, text }) => {
  try {
    const res: QuotesCreateQueryResult = await db
      .insert(quotes)
      .values({ author, text })
      .returning({ insertedId: quotes.id })

    const id = res[0]?.insertedId

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
    const res: QuotesGetByIdQueryResult = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, id))

    const quote = res.length ? res[0] : null

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
    const res: QuotesDeleteByIdQueryResult = await db
      .delete(quotes)
      .where(eq(quotes.id, id))
      .returning({ deletedId: quotes.id })

    const isDeleted = !!res[0]?.deletedId

    return Promise.resolve({ data: isDeleted })
  } catch (err: unknown) {
    return parseError(err)
  }
}
