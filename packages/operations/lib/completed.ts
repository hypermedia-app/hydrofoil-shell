import type { Store } from '@hydrofoil/shell'
import type { RuntimeOperation } from 'alcaeus'
import type { ResponseWrapper } from 'alcaeus/ResponseWrapper'
import type { ResourceRepresentation } from 'alcaeus/ResourceRepresentation'
import { hydra } from '@tpluscode/rdf-ns-builders'
import type { Error } from '@rdfine/hydra/lib/Error'
import type { Payload } from '../index'

export interface OperationCompleted {
  payload: Payload
  operation: RuntimeOperation
  response?: ResponseWrapper
  representation?: ResourceRepresentation
}

export function completed(store: Store) {
  const dispatch = store.getDispatch()

  return function ({ payload, operation, response, representation }: OperationCompleted) {
    if (!response?.xhr.ok) {
      const error = representation?.ofType<Error>(hydra.Error).shift()
      dispatch.operation.failed({ payload, operation, response, error })
      return
    }

    dispatch.operation.succeeded({
      payload,
      operation,
      response,
      representation,
    })
  }
}
