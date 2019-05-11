# `<hydrofoil-shell>`

#### `displays the "ready" slot when there is no model`

```html
<ld-navigator>
</ld-navigator>
<section id="ready">
  <slot>
  </slot>
</section>
<section 
  hidden=""
  id="main"
  >
  <lit-view
    ignore-missing=""
    template-scope="hydrofoil-shell"
  >
  </lit-view>
</section>
<section
  hidden=""
  id="error"
>
  <pre>
  </pre>
</section>

```
