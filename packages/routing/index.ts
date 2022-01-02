import type { Plugin } from '@captaincodeman/rdx'
import url from 'url-state'
import linkHijacker from '@mapbox/link-hijacker'
import type { Model } from '@hydrofoil/shell-core/store'

interface Options {
  appPath?: string
}

interface RoutingDispatch {
  resource(resource: string): void
}

interface Effects {
  goTo(href: string): void
}

interface RoutingState {
  resource: string
}

const reducers = {
  resource(state: any, resource: string) {
    return { ...state, resource }
  },
}

type RoutingModel = Model<RoutingState, typeof reducers, Effects>

export const routing: (params: Options) => Plugin<RoutingModel> = ({ appPath = '/' } = {}) => {
  const appPathPattern = new RegExp(`^${appPath}`)

  const getResourcePath = (href: string) => {
    const resourceUrl = new URL(href)
    const path = resourceUrl.pathname

    if (url.hostname === resourceUrl.hostname) {
      return `${appPath}${path}${resourceUrl.search}`
    }
    return `${appPath}/${href}`
  }

  function goTo(href: string) {
    const path = getResourcePath(href)
    const current = url.pathname + url.search + url.hash
    if (path !== current) {
      url.push(path)
    }
  }

  return {
    model: {
      state: {
        resource: window.location.href,
      },
      reducers,
      effects: () => ({ goTo }),
    },
    onStore(store) {
      const dispatch = store.dispatch.routing as unknown as RoutingDispatch

      function urlChanged() {
        const resource = new URL(url.href)
        resource.pathname = resource.pathname.replace(appPathPattern, '')
        dispatch.resource(resource.href)
      }

      url.addEventListener('change', urlChanged)
      linkHijacker.hijack(({ href }: { href: string }) => goTo(href))

      queueMicrotask(urlChanged)
    },
  }
}
