import { expect, fixture } from '@open-wc/testing'
import { html } from 'lit-html'
import { HydrofoilShell } from '../hydrofoil-shell'

class TestShell extends HydrofoilShell {
  static get properties () {
    return { fakeModel: { type: String } }
  }

  loadResourceInternal () {
    return this.fakeModel
  }
}

customElements.define('hydrofoil-shell', TestShell)

describe('<hydrofoil-shell>', () => {
  it('displays the "ready" slot when there is no model', async () => {
    // given
    const el = await fixture(html`<hydrofoil-shell .fakeModel="${null}"></hydrofoil-shell>`)

    // when
    await el.updateComplete

    // then
    expect(el.state).to.be.equal('ready')
    expect(el).shadowDom.to.equalSnapshot()
  })
})
