import { Store } from '@hydrofoil/shell/store'
import type { RuntimeOperation } from 'alcaeus'
import type { ResponseWrapper } from 'alcaeus/ResponseWrapper'
import type { ResourceRepresentation } from 'alcaeus/ResourceRepresentation'
import { hydra } from '@tpluscode/rdf-ns-builders/strict'
import type { Error } from '@rdfine/hydra/lib/Error'

export interface OperationCompleted {
  operation: RuntimeOperation
  response?: ResponseWrapper
  representation?: ResourceRepresentation
}

export function completed(store: Store) {
  const dispatch = store.getDispatch()

  return function ({ operation, response, representation }: OperationCompleted) {
    if (!response?.xhr.ok) {
      const error = representation?.ofType<Error>(hydra.Error).shift()
      dispatch.operation.failed({ operation, response, error })
      return
    }

    dispatch.operation.succeeded({
      operation,
      response,
      representation,
    })
  }
}
