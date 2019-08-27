import { expect, fixture } from '@open-wc/testing'
import { html } from 'lit-html'
import { customElement } from 'lit-element'
import { HydrofoilShell } from '../hydrofoil-shell'
import '../hydrofoil-shell.ts'

@customElement('snapshot-shell')
class TestShell extends HydrofoilShell {
  public fakeModel?: string

  protected async loadResourceInternal() {
    return this.fakeModel
  }
}

describe('<hydrofoil-shell>', () => {
  it('displays the "ready" slot when there is no model', async () => {
    // given
    const el = await fixture<TestShell>(
      html`
        <snapshot-shell .fakeModel="${null}"></snapshot-shell>
      `,
    )

    // when
    await el.updateComplete

    // then
    expect(el.state).to.be.equal('ready')
    expect(el).shadowDom.to.equalSnapshot()
  })
})
