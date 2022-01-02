import { Model } from '@hydrofoil/shell-core/store'
import type { NamedNode } from '@rdfjs/types'
import reducers from './lib/reducers.js'

export { default as reducers } from './lib/reducers.js'

export interface AuthState {
  isAuthenticated: boolean
}

export interface Effects {
  logIn({ returnTo }: { returnTo?: string | NamedNode }): Promise<void>
  logOut(): Promise<void>
}

type R = typeof reducers
// eslint-disable-next-line
export interface Reducers extends R {
}

declare module '@captaincodeman/rdx/typings/models' {
  interface Models {
    auth: Model<AuthState, Reducers, Effects>
  }
}
