import { JSONSchema7 } from "json-schema"

export const quotesGetByIdSchema: JSONSchema7 = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      pattern: "^\\d+$",
      minLength: 1,
    },
  },
}

export const quotesCreateSchema: JSONSchema7 = {
  type: "object",
  required: ["text"],
  properties: {
    author: {
      type: "string",
      maxLength: 128,
    },
    text: {
      type: "string",
      minLength: 1,
    },
  },
}

export const quotesDeleteByIdSchema: JSONSchema7 = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      pattern: "^\\d+$",
      minLength: 1,
    },
  },
}
