import { Store } from '@hydrofoil/shell/store'
import { invoke } from './invoke.js'
import { completed } from './completed.js'

export function effects(store: Store) {
  return {
    invoke: invoke(store),
    completed: completed(store),
  }
}
