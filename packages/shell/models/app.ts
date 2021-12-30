import { createModel } from '@captaincodeman/rdx'
import { HydraClient } from 'alcaeus/alcaeus'

export interface AppState {
  root: string
  client?: HydraClient
}

const reducers = {
  setClient(state: AppState, client: HydraClient) {
    return {
      ...state, client,
    }
  },
}

export const app = createModel({
  state: <AppState>{},
  reducers,
})
