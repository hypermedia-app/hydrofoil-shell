import { NamedNode } from 'rdf-js'
import type { ResponseWrapper } from 'alcaeus/ResponseWrapper'
import type { ResourceRepresentation } from 'alcaeus/ResourceRepresentation'
import type { Error } from 'alcaeus'
import type { ResourceState } from '..'

export interface RequestFailed {
  id: NamedNode
  response: ResponseWrapper | undefined
  error: Error | undefined
}
export interface RequestSucceeded {
  id: NamedNode
  response: ResponseWrapper
  representation: ResourceRepresentation | undefined
}

type RS = ResourceState

export default {
  loading(state: RS, id: NamedNode): RS {
    state.representations.set(id, { loading: true, success: false })
    return { ...state }
  },
  failed(state: RS, { id, response, error }: RequestFailed): RS {
    state.representations.set(id, { loading: false, success: false, response, error })
    return { ...state }
  },
  succeeded(state: RS, { id, response, representation }: RequestSucceeded): RS {
    state.representations.set(id, {
      loading: false,
      success: true,
      response,
      representation,
      root: representation?.root,
    })
    return { ...state }
  },
}
