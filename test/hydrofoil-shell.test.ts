import { expect, fixture } from '@open-wc/testing'
import { customElement } from 'lit-element'
import { HydrofoilShell } from '../hydrofoil-shell'

@customElement('hydrofoil-shell')
class TestShell extends HydrofoilShell {
  public fakeModel?: string

  protected async loadResourceInternal() {
    return this.fakeModel
  }
}

describe('<hydrofoil-shell>', () => {
  it('renders error section when state is "error"', async () => {
    // given
    const el = await fixture<TestShell>('<hydrofoil-shell></hydrofoil-shell>')

    // when
    el.state = 'error'
    el.lastError = new Error()
    await el.updateComplete

    // then
    const errorSection = el.renderRoot.querySelector('#error') as any
    expect(errorSection.offsetParent).to.not.be.null
  })

  it('should have default display block and no margin', async () => {
    // given
    const el = await fixture<TestShell>('<hydrofoil-shell></hydrofoil-shell>')

    // when
    await el.updateComplete

    // then
    expect(getComputedStyle(el).display).to.equal('block')
    expect(getComputedStyle(el).marginLeft).to.equal('0px')
    expect(getComputedStyle(el).marginRight).to.equal('0px')
    expect(getComputedStyle(el).marginTop).to.equal('0px')
    expect(getComputedStyle(el).marginBottom).to.equal('0px')
  })
})
