import * as rdx from '@captaincodeman/rdx'
import { Models } from '@hydrofoil/shell-core/store'

export { core } from '@hydrofoil/shell-core/core'
export { operation } from '@hydrofoil/shell-operations'
export { default as resource } from '@hydrofoil/shell-resources'
export { routing } from '@hydrofoil/shell-routing'

type Config = rdx.Config & {
  models: Models
}

export function create<C extends Config>(config: C) {
  return rdx.createStore<C>(config)
}

export type State = rdx.StoreState<Parameters<typeof create>[0]>
export type Dispatch = rdx.StoreDispatch<Parameters<typeof create>[0]>
export type Store = rdx.ModelStore<Dispatch, State>
