import type { AuthState } from '..'

export function isAuthenticated(state: AuthState, value: boolean) {
  return {
    ...state,
    isAuthenticated: value,
  }
}
