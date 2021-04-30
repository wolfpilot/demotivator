// Types
import { IApiError } from "@ts/api"

export const isApiError = (props: unknown | IApiError): props is IApiError =>
  // tslint:disable-next-line: strict-type-predicates
  (props as IApiError).success === false
