import { QueryResult } from "pg"

// Types
import { IPaginationData, ModelResponse } from "@ts/api"
import { IQuoteData } from "@ts/data/quotes"

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
export type QuotesListResponse = ModelResponse<IQuoteData[], IPaginationData>
export type QuotesCreateResponse = ModelResponse<{ id: string }>
export type QuotesGetByIdResponse = ModelResponse<IQuoteData>
export type QuotesDeleteByIdResponse = ModelResponse<void>

// Requests
export type ModelList = (args: {
  limit: number
  page: number
}) => Promise<QuotesListResponse>

export type ModelCreate = (args: {
  author?: string
  text: string
}) => Promise<QuotesCreateResponse>

export type ModelGetById = (args: {
  id: string
}) => Promise<QuotesGetByIdResponse>

export type ModelDeleteById = (args: {
  id: string
}) => Promise<QuotesDeleteByIdResponse>
