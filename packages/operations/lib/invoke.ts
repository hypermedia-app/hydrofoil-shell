import type { RuntimeOperation } from 'alcaeus'
import { GraphPointer } from 'clownface'
import { turtle } from '@tpluscode/rdf-string'
import { Store } from '@hydrofoil/shell-core/store'

export interface InvokeOperation {
  operation: RuntimeOperation
  payload: GraphPointer
}

export function invoke(store: Store) {
  const dispatch = store.getDispatch()

  return async ({ operation, payload }: InvokeOperation) => {
    dispatch.operation.startLoading(operation)

    const response = await operation.invoke(turtle`${payload.dataset}`.toString(), {
      'content-type': 'text/turtle',
    })

    dispatch.operation.completed({ operation, ...response })
  }
}
