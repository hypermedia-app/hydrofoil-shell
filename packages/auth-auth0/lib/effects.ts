import { NamedNode } from '@rdfjs/types'
import type { Store } from '@hydrofoil/shell'
import type { Options } from '..'

export function prepareEffects(options: Options) {
  return function effects(store: Store) {
    const dispatch = store.getDispatch()

    return {
      async initialize() {
        const auth0 = await import('@auth0/auth0-spa-js')

        const client = await auth0.default({
          ...options,
          redirect_uri: `${window.location.origin}${options.appPath}`,
          useRefreshTokens: true,
        })

        dispatch.auth.isAuthenticated(await client.isAuthenticated())

        const query = window.location.search
        if (query.includes('code=') && query.includes('state=')) {
          client.handleRedirectCallback()
            .then((result) => {
              dispatch.auth.setClient({
                client,
                referrer: result.appState.resourceId,
                redirected: true,
              })
              dispatch.auth.isAuthenticated(true)
            })
            .catch(() => {
              dispatch.auth.setClient({ client, redirected: true })
            })
          return
        }

        dispatch.auth.setClient({ client, redirected: false })
      },
      logIn() {
        const {
          core: { contentResource },
        } = store.getState()

        dispatch.auth.logInWithRedirect({ returnTo: contentResource?.id.value })
      },
      async logInWithRedirect({ returnTo }: { returnTo?: string | NamedNode }) {
        const {
          auth: { auth0 },
        } = store.getState()

        let resourceId: string | undefined
        if (typeof returnTo === 'string') {
          resourceId = returnTo
        } else {
          resourceId = returnTo?.value
        }

        await auth0?.loginWithRedirect({
          appState: {
            resourceId,
          },
        })
      },
      async logOutWithRedirect(returnTo: string | undefined) {
        const { auth0 } = store.getState().auth
        await auth0?.logout({ returnTo })
        dispatch.auth.isAuthenticated(false)
      },
      logOut() {
        dispatch.auth.logOutWithRedirect(undefined)
      },
    }
  }
}
