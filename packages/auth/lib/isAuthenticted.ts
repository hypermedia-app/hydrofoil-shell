import type { AuthState } from '..'

export function isAuthenticated(state: AuthState, value: boolean): AuthState {
  return {
    ...state,
    isAuthenticated: value,
  }
}
