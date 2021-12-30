import type { Error, RuntimeOperation } from 'alcaeus'
import type { ResponseWrapper } from 'alcaeus/ResponseWrapper'
import type { ResourceRepresentation } from 'alcaeus/ResourceRepresentation'
import type { OperationsState } from '..'

export interface OperationCompleted {
  operation: RuntimeOperation
}

export interface OperationFailed extends OperationCompleted {
  response?: ResponseWrapper
  error: Error
}

export interface OperationSucceeded extends OperationCompleted {
  response: ResponseWrapper
  representation?: ResourceRepresentation
}

export default {
  startLoading(state: OperationsState, operation: RuntimeOperation) {
    state.operations.set(operation.id, { loading: true })
    return state
  },
  failed(state: OperationsState, { operation, error, response }: OperationFailed) {
    state.operations.set(operation.id, { success: false, error, response })
    return state
  },
  succeeded(state: OperationsState, { operation, response, representation }: OperationSucceeded) {
    state.operations.set(operation.id, { success: true, response, representation })
    return state
  },
}
