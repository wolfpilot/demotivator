import { JSONSchema7 } from "json-schema"

export const quotesGetByIdSchema: JSONSchema7 = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      pattern: "^\\d+$",
    },
  },
}
