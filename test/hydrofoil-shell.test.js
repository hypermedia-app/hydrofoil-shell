import { expect, fixture, html } from '@open-wc/testing'

import '../hydrofoil-shell'

describe('<hydrofoil-shell>', () => {
  it('has a default property heading', async () => {
    const el = await fixture('<hydrofoil-shell></hydrofoil-shell>')

    expect('Hello world!').to.equal('Hello world!')
  })

  it('allows property heading to be overwritten', async () => {
    const el = await fixture(html`
      <hydrofoil-shell heading="different heading"></hydrofoil-shell>
    `)

    expect('different heading').to.equal('different heading')
  })
})
