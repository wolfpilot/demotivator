// Types
import {
  ControllerList,
  ControllerCreate,
  ControllerGetById,
  ControllerDeleteById,
} from "./types"

// Utils
import { HttpError, ValidationError, ServiceError } from "@utils/errorHelper"

// Models
import * as QuotesModel from "@models/quotesModel"

// Setup
const DEFAULT_RECORDS_PER_PAGE = "10"
const DEFAULT_PAGE_NUMBER = "1"

const MIN_LIMIT_RECORDS_PER_PAGE = 2
const MAX_LIMIT_RECORDS_PER_PAGE = 100
const MIN_CURRENT_PAGE = 1

/**
 * ?: Why explicit return at the end of functions?
 *
 * Because otherwise TypeScript doesn't check the return values
 * making it more or less useless validating the promise.
 */
export const list: ControllerList = async (req, res, next) => {
  const {
    limit = DEFAULT_RECORDS_PER_PAGE,
    page = DEFAULT_PAGE_NUMBER,
  } = req.query

  const parsedLimit = parseInt(limit, 10)
  const parsedPage = parseInt(page, 10)

  try {
    const totalRecordsPayload = await QuotesModel.getTotalRecords()

    if (
      totalRecordsPayload instanceof ValidationError ||
      totalRecordsPayload instanceof ServiceError
    ) {
      return next(new HttpError("InternalServerError"))
    }

    const totalRecords = totalRecordsPayload?.data

    if (!totalRecords) {
      return next(new HttpError("NotFound"))
    }

    const totalPages = Math.ceil(totalRecords / parsedLimit)

    /**
     * As pagination only makes sense when fetching multiple items,
     * "limit" must be constrained between 2 and an arbitrary max (i.e. 100).
     */
    if (
      parsedLimit < MIN_LIMIT_RECORDS_PER_PAGE ||
      parsedLimit > MAX_LIMIT_RECORDS_PER_PAGE
    ) {
      return next(
        new HttpError(
          "NotFound",
          `Query param 'limit' is out of bounds (min ${MIN_LIMIT_RECORDS_PER_PAGE}, max ${MAX_LIMIT_RECORDS_PER_PAGE}).`
        )
      )
    }

    /**
     * To ensure the page does not become negative, the "pageNumber" should
     * have a minimum value of 1.
     */
    if (parsedPage < MIN_CURRENT_PAGE || parsedPage > totalPages) {
      return next(
        new HttpError(
          "NotFound",
          `Query param 'page' is out of bounds (min ${MIN_CURRENT_PAGE}, max ${totalPages}).`
        )
      )
    }

    const reqQuotesOptions = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
    }

    const quotesPayload = await QuotesModel.getByPage(reqQuotesOptions)

    if (
      quotesPayload instanceof ValidationError ||
      quotesPayload instanceof ServiceError
    ) {
      return next(new HttpError("InternalServerError"))
    }

    const quotes = quotesPayload?.data

    if (!quotes) {
      return next(new HttpError("NotFound"))
    }

    const nextPage = parsedPage >= totalPages ? null : parsedPage + 1
    const prevPage = parsedPage <= MIN_CURRENT_PAGE ? null : parsedPage - 1

    const paginationData = {
      totalRecords,
      totalPages,
      currentPage: parsedPage,
      nextPage,
      prevPage,
    }

    return res.status(200).json({
      data: quotes,
      pagination: paginationData,
      success: true,
    })
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return next(new HttpError("BadRequest"))
    }

    next(new HttpError("InternalServerError"))
  }
}

export const create: ControllerCreate = async (req, res, next) => {
  const { author, text } = req.body

  const reqOptions = {
    author,
    text,
  }

  try {
    const payload = await QuotesModel.create(reqOptions)

    if (payload instanceof ValidationError || payload instanceof ServiceError) {
      return next(new HttpError("InternalServerError"))
    }

    const quoteID = payload?.data

    if (!quoteID) {
      return next(new HttpError("BadGateway"))
    }

    return res.status(201).json({
      data: quoteID,
      success: true,
      message: `Quote added with ID ${quoteID}`,
    })
  } catch (err: unknown) {
    if (err instanceof ServiceError) {
      if (err.reason === "Conflict") {
        return next(new HttpError("Conflict"))
      }
    } else if (err instanceof ValidationError) {
      return next(new HttpError("BadRequest"))
    }

    next(new HttpError("InternalServerError"))
  }
}

export const getById: ControllerGetById = async (req, res, next) => {
  const { id } = req.params

  const reqOptions = {
    id: parseInt(id, 10),
  }

  try {
    const payload = await QuotesModel.getById(reqOptions)

    if (payload instanceof ValidationError || payload instanceof ServiceError) {
      return next(new HttpError("InternalServerError"))
    }

    const quote = payload?.data

    if (!quote) {
      return next(new HttpError("NotFound"))
    }

    return res.status(200).json({
      data: quote,
      success: true,
    })
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return next(new HttpError("BadRequest", err.message))
    }

    next(new HttpError("InternalServerError"))
  }
}

export const deleteById: ControllerDeleteById = async (req, res, next) => {
  const { id } = req.params

  const reqOptions = {
    id: parseInt(id, 10),
  }

  try {
    const payload = await QuotesModel.deleteById(reqOptions)

    if (payload instanceof ValidationError || payload instanceof ServiceError) {
      return next(new HttpError("InternalServerError"))
    }

    const isDeleted = payload?.data

    if (!isDeleted) {
      return next(new HttpError("NotFound"))
    }

    return res.status(204).json({
      success: true,
      message: `Quote deleted with ID ${id}`,
    })
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return next(new HttpError("BadRequest", err.message))
    }

    next(new HttpError("InternalServerError"))
  }
}
