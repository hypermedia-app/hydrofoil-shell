import type { Error } from 'alcaeus'
import type { ResponseWrapper } from 'alcaeus/ResponseWrapper'
import type { ResourceRepresentation } from 'alcaeus/ResourceRepresentation'
import { createModel } from '@captaincodeman/rdx'
import { Model } from '@hydrofoil/shell/store'
import { Term } from '@rdfjs/types'
import { effects } from './lib/effects'
import reducers from './lib/reducers'

type OperationResult = { loading: true }
| { success: false; response?: ResponseWrapper; error?: Error }
| { success: true; response: ResponseWrapper; representation?: ResourceRepresentation }

export interface OperationsState {
  operations: Map<Term, OperationResult>
}

export const operations = createModel({
  state: <OperationsState>{},
  reducers,
  effects,
})

type R = typeof reducers
// eslint-disable-next-line
export interface Reducers extends R {
}

type E = ReturnType<typeof effects>
// eslint-disable-next-line
export interface Effects extends E {
}

declare module '@captaincodeman/rdx/typings/models' {
  interface Models {
    operation: Model<OperationsState, Reducers, Effects>
  }
}
