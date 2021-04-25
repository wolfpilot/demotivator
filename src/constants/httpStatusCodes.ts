// Shamelessly referenced from Google's Webmaster Tools v3
// standard error responses documentation. More info at:
//
// https://developers.google.com/webmaster-tools/search-console-api-original/v3/errors
export interface IHttpStatusCodes {
  [key: number]: {
    [key: string]: string
  }
}

export const httpStatusCodes: IHttpStatusCodes = {
  400: {
    badRequest:
      "The API request is invalid or improperly formed. Consequently, the API server could not understand the request.",
    invalid:
      "The request failed because it contained an invalid value. The value could be a parameter value, a header value, or a property value.",
    parseError: "The API server cannot parse the request body.",
    required:
      "The API request is missing required information. The required information could be a parameter or resource property.",
    unknownApi: "The API that the request is calling is not recognized.",
  },
  404: {
    notFound:
      "The requested operation failed because a resource associated with the request could not be found.",
  },
}
