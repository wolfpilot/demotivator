export const SERVICE_ERROR_NAME = "ServiceError"

export enum ServiceErrorReasons {
  Conflict = "Conflict",
  Unhandled = "Unhandled",
}

export interface ServiceError {
  reason: ServiceErrorReasons
  message: string
}

export type ServiceErrors = Record<
  keyof typeof ServiceErrorReasons,
  ServiceError
>

export const serviceErrors: ServiceErrors = {
  Conflict: {
    reason: ServiceErrorReasons.Conflict,
    message:
      "The API request cannot be completed because the requested operation would conflict with an existing item. For example, a request that tries to create a duplicate item would create a conflict, though duplicate items are typically identified with more specific errors.",
  },
  Unhandled: {
    reason: ServiceErrorReasons.Unhandled,
    message: "The request failed due to an internal error.",
  },
}
