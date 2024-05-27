// Types
import { ModelResponse } from "@ts/api"
import { QuoteData } from "@ts/data/quotes"

// Queries
export type QuotesGetTotalRecordsQueryResult = {
  count: number
}[]

export type QuotesGetByPageQueryResult = QuoteData[]

export type QuotesCreateQueryResult = {
  insertedId: number
}[]

export type QuotesGetByIdQueryResult = QuoteData[]

export type QuotesDeleteByIdQueryResult = {
  deletedId: number
}[]

// Responses
export type QuotesGetTotalRecordsResponse = ModelResponse<number>
export type QuotesGetByPageResponse = ModelResponse<QuoteData[] | null>
export type QuotesCreateResponse = ModelResponse<number>
export type QuotesGetByIdResponse = ModelResponse<QuoteData | null>
export type QuotesDeleteByIdResponse = ModelResponse<boolean>

// Models
export type ModelGetTotalRecords = () => Promise<QuotesGetTotalRecordsResponse>

export type ModelGetByPage = (args: {
  limit: number
  page: number
}) => Promise<QuotesGetByPageResponse>

export type ModelCreate = (args: {
  author?: string
  text: string
}) => Promise<QuotesCreateResponse>

export type ModelGetById = (args: {
  id: number
}) => Promise<QuotesGetByIdResponse>

export type ModelDeleteById = (args: {
  id: number
}) => Promise<QuotesDeleteByIdResponse>
