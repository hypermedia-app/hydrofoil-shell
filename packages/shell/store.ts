import * as rdx from '@captaincodeman/rdx'
import { core } from './core'

type ReducerFns = Record<any, any>
type EffectFns = Record<any, any>
type ExtractIndexer<T> = { [K in keyof T]: T[K] }
export type Model<S, R extends ReducerFns = any, E extends EffectFns = any>
  = rdx.Model<S, ExtractIndexer<R>, ExtractIndexer<E>>

export type State = rdx.StoreState<rdx.Config>
export type Dispatch = rdx.StoreDispatch<rdx.Config>
export type Store = rdx.ModelStore<Dispatch, State>

export type DispatchParam<
  M extends keyof ReturnType<Store['getDispatch']>,
  D extends keyof ReturnType<Store['getDispatch']>[M]
> = Parameters<ReturnType<Store['getDispatch']>[M][D]>[0]

export function create<T extends Record<string, rdx.Model>>(
  models: Omit<rdx.Models, 'core'> & T,
  plugins?: rdx.Plugins,
) {
  const allModels = { ...models, core } as any as rdx.Models

  return rdx.createStore({ models: allModels, plugins })
}
