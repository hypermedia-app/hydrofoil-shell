import { createModel } from '@captaincodeman/rdx'
import type { Model } from '@hydrofoil/shell-core/store'
import type { Store } from '@hydrofoil/shell'
import { Term } from '@rdfjs/types'
import type { ResponseWrapper } from 'alcaeus/ResponseWrapper'
import type { ResourceRepresentation } from 'alcaeus/ResourceRepresentation'
import TermMap from '@rdf-esm/term-map'
import { NamedNode } from 'rdf-js'
import { namedNode } from '@rdf-esm/data-model'
import type { Resource, Error } from 'alcaeus'
import { hydra } from '@tpluscode/rdf-ns-builders'
import reducers from './lib/reducers.js'

type RepresentationState = {
  loading: true
  success: false
  response?: undefined
  representation?: undefined
  root?: undefined
  error?: undefined
}
| {
  loading: false
  success: true
  response: ResponseWrapper
  representation: ResourceRepresentation | undefined
  root: Resource | undefined | null
  error?: undefined
}
| {
  loading: false
  success: false
  response: ResponseWrapper | undefined
  representation?: undefined
  root?: undefined
  error: Error | undefined
}

export interface ResourceState {
  representations: Map<Term, RepresentationState>
}

interface RequestCompleted {
  id: NamedNode
  response?: ResponseWrapper
  representation?: ResourceRepresentation
}

function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    async load(arg: string | NamedNode) {
      const { client } = store.getState().core
      const { representations } = store.getState().resource

      if (!client) {
        return
      }

      const id = typeof arg === 'string' ? namedNode(arg) : arg
      if (representations.get(id)?.loading === true) {
        return
      }

      dispatch.resource.loading(id)
      const response = await client.loadResource(id)

      dispatch.resource.requestCompleted({ id, ...response })
    },
    requestCompleted({ id, response, representation }: RequestCompleted) {
      if (response?.xhr.ok) {
        dispatch.resource.succeeded({ id, response, representation })
      } else {
        const [error] = representation?.ofType<Error>(hydra.Error) || []
        dispatch.resource.failed({ id, response, error })
      }
    },
    'routing/resource': (id: string) => {
      const newUrl = new URL(id)
      newUrl.hash = ''
      const currentId = store.getState().core.contentResource?.id.value
      if (currentId) {
        const currentUrl = new URL(currentId)
        currentUrl.hash = ''

        if (currentUrl.toString() === newUrl.toString()) {
          return
        }
      }

      dispatch.resource.load(id)
    },
  }
}

export default createModel({
  state: <ResourceState>{
    representations: new TermMap(),
  },
  reducers,
  effects,
})

declare module '@hydrofoil/shell-core/store' {
  interface Models {
    resource: Model<ResourceState, typeof reducers, ReturnType<typeof effects>>
  }
}
