import { createModel } from '@captaincodeman/rdx'
import { HydraClient } from 'alcaeus/alcaeus'
import type { GraphPointer } from 'clownface'
import type { Term } from '@rdfjs/types'
import type { Store, Model } from './store.js'

export interface CoreState {
  rootResource?: {
    id: Term
    pointer?: GraphPointer
  }
  contentResource?: {
    id: Term
    pointer?: GraphPointer
  }
  entrypoint?: GraphPointer
  client?: HydraClient
}

declare module '@captaincodeman/rdx/typings/models' {
  interface Models {
    core: Model<CoreState, typeof reducers, ReturnType<typeof effects>>
  }
}

interface SetContentResource {
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
  setContentResource(state: CoreState, { id, pointer }: SetContentResource): CoreState {
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
