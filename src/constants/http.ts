// Utils
import { asStrings } from "../utils/typeHelper"

/**
 * Shamelessly referenced from Google's Webmaster Tools v3
 * standard error responses documentation. More info at:
 *
 * https://developers.google.com/webmaster-tools/search-console-api-original/v3/errors
 */
export const httpStatusMessages = {
  400: asStrings({
    badRequest:
      "The API request is invalid or improperly formed. Consequently, the API server could not understand the request.",
    invalid:
      "The request failed because it contained an invalid value. The value could be a parameter value, a header value, or a property value.",
    parseError: "The API server cannot parse the request body.",
    required:
      "The API request is missing required information. The required information could be a parameter or resource property.",
    unknownApi: "The API that the request is calling is not recognized.",
  }),
  404: asStrings({
    notFound:
      "The requested operation failed because a resource associated with the request could not be found.",
  }),
  409: asStrings({
    conflict:
      "The API request cannot be completed because the requested operation would conflict with an existing item. For example, a request that tries to create a duplicate item would create a conflict, though duplicate items are typically identified with more specific errors.",
    duplicate:
      "The requested operation failed because it tried to create a resource that already exists.",
  }),
  500: asStrings({
    internalError: "The request failed due to an internal error.",
  }),
  503: asStrings({
    backendError: "A backend error occurred.",
    backendNotConnected: "The request failed due to a connection error.",
    notReady: "The API server is not ready to accept requests.",
  }),
}
