import { expect, fixture } from '@open-wc/testing'
import { HydrofoilShell } from '../hydrofoil-shell'

class TestShell extends HydrofoilShell {
  loadResourceInternal () {
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

  it('should have default display block and no margin', async () => {
      // given
      const el = await fixture('<hydrofoil-shell></hydrofoil-shell>')

      // when
      await el.updateComplete

      // then
      expect(getComputedStyle(el).display).to.equal('block')
      expect(getComputedStyle(el).margin).to.equal('0px')
  })
})
