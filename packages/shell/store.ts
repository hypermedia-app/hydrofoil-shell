import * as rdx from '@captaincodeman/rdx'

type ReducerFns = Record<any, any>
type EffectFns = Record<any, any>
type ExtractIndexer<T> = { [K in keyof T]: T[K] }
export type Model<S, R extends ReducerFns = any, E extends EffectFns = any>
  = rdx.Model<S, ExtractIndexer<R>, ExtractIndexer<E>>

export type State = rdx.StoreState<rdx.Config>
export type Dispatch = rdx.StoreDispatch<rdx.Config>
export type Store = rdx.ModelStore<Dispatch, State>

export function create<T extends Record<string, rdx.Model>>(models: rdx.Models & T) {
  return rdx.createStore({ models })
}
