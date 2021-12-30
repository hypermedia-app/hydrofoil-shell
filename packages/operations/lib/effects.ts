import { Store } from '@hydrofoil/shell/store'
import { invoke } from './invoke'

export function effects(store: Store) {
  return {
    invoke: invoke(store),
  }
}
