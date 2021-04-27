// Types
import { IApiError } from "./api"

export const isApiError = (props: unknown | IApiError): props is IApiError =>
  // tslint:disable-next-line: strict-type-predicates
  (props as IApiError).success === false
