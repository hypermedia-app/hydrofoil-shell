import type { Auth0Client, Auth0ClientOptions } from '@auth0/auth0-spa-js'
import { AuthState, reducers } from '@hydrofoil/shell-auth'
import { createModel } from '@captaincodeman/rdx'
import { prepareEffects } from './lib/effects.js'
import auth0reducers from './lib/reducers.js'

export interface Options extends Auth0ClientOptions {
  appPath: string
}
type R = typeof auth0reducers
type E = ReturnType<ReturnType<typeof prepareEffects>>

declare module '@hydrofoil/shell-auth' {
  interface AuthState {
    auth0: Auth0Client
  }

  // eslint-disable-next-line
  interface Effects extends E {
  }

  // eslint-disable-next-line
  interface Reducers extends R {
  }
}

export default (options: Options) => createModel({
  state: <AuthState>{
    isAuthenticated: false,
  },
  reducers: { ...reducers, ...auth0reducers },
  effects: prepareEffects(options),
})
