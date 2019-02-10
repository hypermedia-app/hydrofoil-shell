## hydrofoil-shell

UI-agnostic base element which can be used to build hypermedia-driven
single page applications.

Implemented using [`lit-element`][le]

[le]: https://lit-element.polymer-project.org

### `<hydrofoil-shell>`

The core element, which manages a state (single [resource representation][rr]).

This element is abstract. It does not:

* handle of client-server interaction (doesn't load the resource)
* does not render any shell UI
* delegates the rending of resource representations to [`<lit-view>` element][la]

[rr]: https://restful-api-design.readthedocs.io/en/latest/resources.html
[la]: https://lit-any.hypermedia.app/?selectedKind=lit-view&selectedStory=basic&full=0&addons=1&stories=1&panelRight=1&addonPanel=storybooks%2Fstorybook-addon-knobs

#### Using the element

In order to actually deploy a shell element simple steps are required:

1. inherit from the base
1. implement `loadResourceInternal`
1. override `renderMain` to create some core app UI

Here's an example of how this would be done

```js
import HydrofoilShell from '@hydrofoil-shell/hydrofoil-shell/hydrofoil-shell`
import {customElement, html} from 'lit-element'

@customElement('my-app-shell')
export default class MyAppShell extends HydrofoilShell {
  renderMain () {
    // call base to keep using <lit-view> to render the actual resource
    return html`
      <nav>Some static menu</nav>
      <section class=main>
        ${base.renderMain()}
      </section>
      <footer>Footer element</footer>
    `
  }

  loadResourceInternal (uri) {
    return fetch(uri)
  }
}
```

The base shell element does not implement the actual loading so that it's not
being coupled with a single client library or API implementation. Still, instead of
repeating the load method every time you should build a hydrofoil application,
a mixin can be used instead to reuse the logic for loading the resources.

For example, Hydra APIs can be consumed by mixing in [`alcaeus-loader`][al]

```diff
+import AlcaeusLoader from '@hydrofoil-shell/alcaeus-loader`

@customElement('my-app-shell')
-export default class MyAppShell extends HydrofoilShell {
+export default class MyAppShell extends AlcaeusLoader(HydrofoilShell) {

-  loadResourceInternal (uri) {
-    return fetch(uri)
-  }
}
```

[al]: https://github.com/hypermedia-app/alcaeus-loader

### `<hydrofoil-multi-resource-view>`

A helper element, which helps manage multiple resource. Just as the base shell
element, it only serves as a skeleton and needs to be inherited to actually serve
as a presentation layer.

For examples check out the material design implementations [`hydrofoil-resource-tabs`][hr-tabs]
and [`hydrofoil-resource-accordion`][hr-accordion].

[hr-tabs]: https://github.com/hypermedia-app/hydrofoil-paper-shell/blob/master/hydrofoil-resource-tabs.ts
[hr-accordion]: https://github.com/hypermedia-app/hydrofoil-paper-shell/blob/master/hydrofoil-resource-accordion.ts

#### Usage

The element is controlled by standard DOM events. To add a resource to the ones displayed
dispatch `hydrofoil-append-resource` from any child element.

```js
child.dispatchEvent(new CustomEvent('hydrofoil-append-resource', {
  bubbles: true,
  composed: true,
  detail: {
    parent: currentResource,
    resource: nextResource,
  },
}))
```

Both `parent` and `resource` are mandatory. If `parent` is not the topmost resource on the stack
all its current children will be replaced with `nextResource`.

To remove an element from the stack, dispatch `hydrofoil-close-resource`. This will also remove
any other resources higher on the stack.

```js
child.dispatchEvent(new CustomEvent('hydrofoil-append-resource', {
  bubbles: true,
  composed: true,
  detail: {
    resource: removedResource,
  },
}))
```

##### Examples

| Before | event | After |
| -- | -- | -- |
| resA | hydrofoil-append-resource<br>parent: resA<br>- resource: resB | resA<br>resB |
| resA<br>resB | hydrofoil-append-resource<br>- parent: resA<br>r- esource: resC | resA<br>resC |
| resA<br>resC | hydrofoil-append-resource<br>- parent: resC<br>- resource: resD | resA<br>resC<br>resD |
| resA<br>resC<br>resD | hydrofoil-close-resource<br>- resource: resC | resA |
