import type { Error } from 'alcaeus'
import type { ResponseWrapper } from 'alcaeus/ResponseWrapper'
import type { ResourceRepresentation } from 'alcaeus/ResourceRepresentation'
import { createModel } from '@captaincodeman/rdx'
import { Model } from '@hydrofoil/shell-core/store'
import { Term } from '@rdfjs/types'
import TermMap from '@rdf-esm/term-map'
import { effects } from './lib/effects.js'
import reducers from './lib/reducers.js'

interface OperationResult<Loading, Success, Response, Err, Representation> {
  loading: Loading
  success: Success
  response: Response
  error: Err
  representation: Representation
}

export type UndefinedResult = OperationResult<true, undefined, undefined, undefined, undefined>
// eslint-disable-next-line max-len
export type FailureResult = OperationResult<false, false, ResponseWrapper | undefined, Error | undefined, undefined>
// eslint-disable-next-line max-len
export type SuccessResult = OperationResult<false, true, ResponseWrapper, undefined, ResourceRepresentation | undefined>

export interface OperationsState {
  operations: Map<Term, UndefinedResult | SuccessResult | FailureResult>
}

export const operation = createModel({
  state: <OperationsState>{
    operations: new TermMap(),
  },
  reducers,
  effects,
})

declare module '@hydrofoil/shell-core/store' {
  interface Models {
    operation: Model<OperationsState, typeof reducers, ReturnType<typeof effects>>
  }
}
