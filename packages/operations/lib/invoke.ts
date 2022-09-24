import type { RuntimeOperation } from 'alcaeus'
import { turtle } from '@tpluscode/rdf-string'
import type { Store } from '@hydrofoil/shell'
import type { Payload } from '../index'

export interface InvokeOperation {
  operation: RuntimeOperation
  payload: Payload
  headers?: HeadersInit
}

export function invoke(store: Store) {
  const dispatch = store.getDispatch()

  return async ({ operation, payload, headers }: InvokeOperation) => {
    dispatch.operation.startLoading(operation)

    const response = await operation.invoke(turtle`${payload.dataset}`.toString(), {
      ...headers,
      'content-type': 'text/turtle',
    })

    dispatch.operation.completed({ payload, operation, ...response })
  }
}
