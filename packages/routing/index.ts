import type { Plugin } from '@captaincodeman/rdx'
import url from 'url-state'
import linkHijacker from '@mapbox/link-hijacker'

interface Options {
  appPath?: string
}

interface RoutingDispatch {
  resource(resource: string): void
}

export const routing: (params: Options) => Plugin = ({ appPath = '/' } = {}) => {
  const appPathPattern = new RegExp(`^${appPath}`)

  const getResourcePath = (href: string) => {
    const resourceUrl = new URL(href)
    const path = resourceUrl.pathname

    if (url.hostname === resourceUrl.hostname) {
      return `${appPath}${path}${resourceUrl.search}`
    }
    return `${appPath}/${href}`
  }

  return {
    model: {
      state: {},
      reducers: {
        resource(state: any, resource: string) {
          return { ...state, resource }
        },
      },
    },
    onStore(store) {
      const dispatch = store.dispatch.routing as unknown as RoutingDispatch

      function urlChanged() {
        const resource = new URL(url.href)
        resource.pathname = resource.pathname.replace(appPathPattern, '')
        dispatch.resource(resource.href)
      }

      url.addEventListener('change', urlChanged)
      linkHijacker.hijack(({ href }: { href: string}) => {
        const path = getResourcePath(href)
        if (path !== url.pathname) {
          url.push(path)
        }
      })

      queueMicrotask(urlChanged)
    },
  }
}
