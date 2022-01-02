import type { Error } from 'alcaeus'
import type { ResponseWrapper } from 'alcaeus/ResponseWrapper'
import type { ResourceRepresentation } from 'alcaeus/ResourceRepresentation'
import { createModel } from '@captaincodeman/rdx'
import { Model } from '@hydrofoil/shell-core/store'
import { Term } from '@rdfjs/types'
import TermMap from '@rdf-esm/term-map'
import { effects } from './lib/effects.js'
import reducers from './lib/reducers.js'

type OperationResult = { loading: true }
| { success: false; response?: ResponseWrapper; error?: Error }
| { success: true; response: ResponseWrapper; representation?: ResourceRepresentation }

export interface OperationsState {
  operations: Map<Term, OperationResult>
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
