import { QueryResult } from "pg"

// Types
import { ModelResponse } from "@ts/api"
import { QuoteData } from "@ts/data/quotes"

// Queries
export interface QuotesGetTotalRecordsQueryResult extends QueryResult {
  rows: {
    count: number
  }[]
}

export interface QuotesGetByPageQueryResult extends QueryResult {
  rows: QuoteData[]
}

export interface QuotesCreateQueryResult extends QueryResult {
  rows: {
    id: number
  }[]
}

export interface QuotesGetByIdQueryResult extends QueryResult {
  rows: QuoteData[]
}

export interface QuotesDeleteByIdQueryResult extends QueryResult {
  rows: QuoteData[]
}

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
