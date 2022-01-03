import { createModel } from '@captaincodeman/rdx'
import { HydraClient } from 'alcaeus/alcaeus'
import type { GraphPointer } from 'clownface'
import type { Term } from '@rdfjs/types'
import type { Store } from '@hydrofoil/shell'
import type { RdfResource } from 'alcaeus'
import type { Model } from './store.js'

export interface CoreState {
  rootResource?: {
    id: Term
    pointer?: GraphPointer
  }
  contentResource?: {
    id: Term
    pointer?: GraphPointer
  } | RdfResource
  entrypoint?: GraphPointer
  client?: HydraClient
}

declare module '@hydrofoil/shell-core/store' {
  interface Models {
    core: Model<CoreState, typeof reducers, ReturnType<typeof effects>>
  }
}

type SetContentResource = RdfResource | {
  id?: Term
  pointer: GraphPointer
}

const reducers = {
  clientReady(state: CoreState, client: HydraClient): CoreState {
    return {
      ...state, client,
    }
  },
  setRootResource(state: CoreState, pointer: GraphPointer): CoreState {
    return {
      ...state,
      rootResource: {
        id: pointer.term,
        pointer,
      },
    }
  },
  setContentResource(state: CoreState, arg: SetContentResource): CoreState {
    if ('types' in arg) {
      return {
        ...state,
        contentResource: arg,
      }
    }

    const { id, pointer } = arg
    return {
      ...state,
      contentResource: {
        id: id || pointer.term,
        pointer,
      },
    }
  },
  setEntrypoint(state: CoreState, entrypoint: GraphPointer): CoreState {
    return {
      ...state, entrypoint,
    }
  },
}

function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    async initialize() {
      const { client } = store.getState().core

      if (!client) {
        const { Hydra } = await import('alcaeus/web')
        dispatch.core.clientReady(Hydra)
      }
    },
  }
}

export const core = createModel({
  state: <CoreState>{},
  reducers,
  effects,
})
