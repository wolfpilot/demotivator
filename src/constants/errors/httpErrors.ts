export enum HttpStatusNames {
  // 400
  BadRequest = "BadRequest",
  // 403
  Forbidden = "Forbidden",
  // 404
  NotFound = "NotFound",
  // 409
  Conflict = "Conflict",
  // 415
  UnsupportedMediaType = "UnsupportedMediaType",
  // 500
  InternalServerError = "InternalServerError",
  // 502
  BadGateway = "BadGateway",
  // 503
  ServiceUnavailable = "ServiceUnavailable",
}

export interface HttpError {
  status: number
  name: HttpStatusNames
  message: string
}

export type HttpErrors = Record<keyof typeof HttpStatusNames, HttpError>

/**
 * Shamelessly plugged from Google's Webmaster Tools v3 standard error responses documentation.
 *
 * @see https://developers.google.com/webmaster-tools/search-console-api-original/v3/errors
 */
export const httpErrors: HttpErrors = {
  BadRequest: {
    status: 400,
    name: HttpStatusNames.BadRequest,
    message:
      "The API request is invalid or improperly formed. Consequently, the API server could not understand the request.",
  },
  Forbidden: {
    status: 403,
    name: HttpStatusNames.Forbidden,
    message: "The requested operation is forbidden and cannot be completed.",
  },
  NotFound: {
    status: 404,
    name: HttpStatusNames.NotFound,
    message:
      "The requested operation failed because a resource associated with the request could not be found.",
  },
  Conflict: {
    status: 409,
    name: HttpStatusNames.Conflict,
    message:
      "The API request cannot be completed because the requested operation would conflict with an existing item. For example, a request that tries to create a duplicate item would create a conflict, though duplicate items are typically identified with more specific errors.",
  },
  UnsupportedMediaType: {
    status: 415,
    name: HttpStatusNames.UnsupportedMediaType,
    message:
      "The content type of the request data or the content type of a part of a multipart request is not supported.",
  },
  InternalServerError: {
    status: 500,
    name: HttpStatusNames.InternalServerError,
    message: "The request failed due to an internal server error.",
  },
  BadGateway: {
    status: 502,
    name: HttpStatusNames.BadGateway,
    message:
      "The request failed due to an invalid response by external API(s).",
  },
  ServiceUnavailable: {
    status: 503,
    name: HttpStatusNames.ServiceUnavailable,
    message: "A backend error occurred.",
  },
}
