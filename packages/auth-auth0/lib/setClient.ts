import type { Auth0Client } from '@auth0/auth0-spa-js'
import { AuthState } from '@hydrofoil/shell-auth'

export interface SetClient {
  client: Auth0Client
  referrer?: string
  redirected: boolean
}

export function setClient(state: AuthState, { client, referrer }: SetClient): AuthState {
  return { ...state, auth0: client, referrer }
}
