import type { RuntimeOperation, Error } from 'alcaeus'
import { GraphPointer } from 'clownface'
import { turtle } from '@tpluscode/rdf-string'
import { hydra } from '@tpluscode/rdf-ns-builders/strict'
import { Store } from '@hydrofoil/shell/store'

export interface InvokeOperation {
  operation: RuntimeOperation
  payload: GraphPointer
}

export function invoke(store: Store) {
  const dispatch = store.getDispatch()

  return async ({ operation, payload }: InvokeOperation) => {
    dispatch.operation.startLoading(operation)

    const { response, representation } = await operation.invoke(turtle`${payload.dataset}`.toString(), {
      'content-type': 'text/turtle',
    })

    if (!response?.xhr.ok) {
      const [error] = representation?.ofType<Error>(hydra.Error) || []
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
