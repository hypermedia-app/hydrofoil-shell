import { expect, fixture, html } from '@open-wc/testing'

import {HydrofoilShell} from '../hydrofoil-shell'

class TestShell extends HydrofoilShell {
  loadResourceInternal(url) {
    return {}
  }
}

customElements.define('hydrofoil-shell', TestShell)

describe('<hydrofoil-shell>', () => {
  it('displays the "ready" slot when there is no model', async () => {
    // given
    const el = await fixture('<hydrofoil-shell></hydrofoil-shell>')

    // when
    el.state = 'ready'
    await el.updateComplete

    // then
    const readySection = el.renderRoot.querySelector('#ready')
    expect(readySection.offsetParent).to.not.be.null
  })

  it('renders error section when state is "error"', async () => {
    // given
    const el = await fixture('<hydrofoil-shell></hydrofoil-shell>')

    // when
    el.state = 'error'
    el.lastError = new Error()
    await el.updateComplete

    // then
    const errorSection = el.renderRoot.querySelector('#error')
    expect(errorSection.offsetParent).to.not.be.null
  })
})
