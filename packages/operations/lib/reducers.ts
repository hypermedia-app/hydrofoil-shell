import type { RuntimeOperation } from 'alcaeus'
import type { Error } from '@rdfine/hydra/lib/Error'
import type { ResponseWrapper } from 'alcaeus/ResponseWrapper'
import type { ResourceRepresentation } from 'alcaeus/ResourceRepresentation'
import type { FailureResult, OperationsState, Payload, SuccessResult } from '..'

export interface OperationCompleted {
  payload: Payload
  operation: RuntimeOperation
}

export interface OperationFailed extends OperationCompleted {
  response?: ResponseWrapper
  error?: Error
}

export interface OperationSucceeded extends OperationCompleted {
  response: ResponseWrapper
  representation?: ResourceRepresentation
}

const nullResult = {
  loading: false as const,
  success: undefined,
  response: undefined,
  error: undefined,
  representation: undefined,
}

export default {
  startLoading(state: OperationsState, operation: RuntimeOperation) {
    state.operations.set(operation.id, { ...nullResult, loading: true })
    return state
  },
  failed(state: OperationsState, { operation, error, response }: OperationFailed) {
    const result: FailureResult = {
      ...nullResult, success: false, error, response,
    }
    state.operations.set(operation.id, result)
    return state
  },
  succeeded(state: OperationsState, { operation, response, representation }: OperationSucceeded) {
    const result: SuccessResult = {
      ...nullResult, success: true, response, representation,
    }
    state.operations.set(operation.id, result)
    return state
  },
}
