import { JSONSchema7 } from "json-schema"

/**
 * * Express will always parse request parameters as strings.
 *
 * As a simple work-around, we will validate them as strings containing only number characters
 * which can be tested against the following RegEx: "^[0-9]+$".
 *
 * @see https://stackoverflow.com/questions/18057850/req-params-number-is-string-in-expressjs
 */
export const quotesListSchema: JSONSchema7 = {
  title: "See a collection of quotes",
  type: "object",
  properties: {
    limit: {
      description: "The amount of records to be fetched from the DB.",
      type: "string",
      pattern: "^[0-9]+$",
      minLength: 1,
    },
    page: {
      description: "The index of the group of records being requested.",
      type: "string",
      pattern: "^[0-9]+$",
      minLength: 1,
    },
  },
}

export const quotesGetByIdSchema: JSONSchema7 = {
  title: "See a specific quote",
  type: "object",
  required: ["id"],
  properties: {
    id: {
      description: "The unique identifier of the record being requested.",
      type: "string",
      pattern: "^[0-9]+$",
      minLength: 1,
    },
  },
}

export const quotesCreateSchema: JSONSchema7 = {
  title: "Add a new quote",
  type: "object",
  required: ["text"],
  properties: {
    author: {
      description: "The author of the quote.",
      type: "string",
      maxLength: 128,
    },
    text: {
      description: "The text itself.",
      type: "string",
      minLength: 1,
      maxLength: 512,
    },
  },
}

export const quotesDeleteByIdSchema: JSONSchema7 = {
  title: "Delete a specific quote",
  type: "object",
  required: ["id"],
  properties: {
    id: {
      description: "The unique identifier of the record being requested.",
      type: "string",
      pattern: "^[0-9]+$",
      minLength: 1,
    },
  },
}
