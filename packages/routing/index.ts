import url from 'url-state'
import linkHijacker from '@mapbox/link-hijacker'

interface Options {
  appPath?: string
  pathPrefix?: string
}

interface RoutingDispatch {
  resource(resource: string): void
}

const reducers = {
  resource(state: any, resource: string) {
    return { ...state, resource }
  },
}

export const routing = ({ appPath = '/', pathPrefix = '' }: Options = {}) => {
  const appPathPattern = new RegExp(`^${appPath}`)
  const prefixPattern = new RegExp(`^${pathPrefix}`)

  const getResourcePath = (href: string) => {
    const resourceUrl = new URL(href)
    const path = resourceUrl.pathname.replace(prefixPattern, '')

    if (url.hostname === resourceUrl.hostname) {
      return `${appPath}${path}${resourceUrl.search}${resourceUrl.hash}`
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
        appPath,
        resource: window.location.href,
      },
      reducers,
      effects: () => ({ goTo }),
    },
    onStore(store: any) {
      const dispatch = store.dispatch.routing as unknown as RoutingDispatch

      function urlChanged() {
        const resource = new URL(url.href)
        resource.pathname = resource.pathname
          .replace(appPathPattern, pathPrefix)
          .replace(/\/$/, '')
        dispatch.resource(resource.href)
      }

      url.addEventListener('change', urlChanged)
      linkHijacker.hijack(({ href }: { href: string }) => goTo(href))

      queueMicrotask(urlChanged)
    },
  }
}
