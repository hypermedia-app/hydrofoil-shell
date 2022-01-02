import * as rdx from '@captaincodeman/rdx'

type ReducerFns = Record<any, any>
type EffectFns = Record<any, any>
type ExtractIndexer<T> = { [K in keyof T]: T[K] }
export type Model<S, R extends ReducerFns = any, E extends EffectFns = any>
  = rdx.Model<S, ExtractIndexer<R>, ExtractIndexer<E>>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Models {
}
