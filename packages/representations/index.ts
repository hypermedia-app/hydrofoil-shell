import { createModel } from '@captaincodeman/rdx'
import { Model, Store } from '@hydrofoil/shell/store'
import reducers from './lib/reducers'

interface Options {
  root: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ResourceState {

}

type R = typeof reducers
// eslint-disable-next-line
export interface Reducers extends R {
}

export default ({ root }: Options) => createModel({
  state: <ResourceState>{
    root,
  },
  reducers,
  effects(store: Store) {
    return {
    }
  },
})

declare module '@captaincodeman/rdx/typings/models' {
  interface Models {
    representations: Model<ResourceState, Reducers>
  }
}
