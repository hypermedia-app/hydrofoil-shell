/* eslint-disable max-classes-per-file */
import { expect, fixture } from '@open-wc/testing'
import { customElement, html } from 'lit-element'
import { HydrofoilShell } from '../hydrofoil-shell'

@customElement('hydrofoil-shell')
class TestShell extends HydrofoilShell {
  public fakeModel?: any
  public onResourceLoadedWith?: unknown

  protected async loadResourceInternal() {
    return this.fakeModel
  }

  protected onResourceLoaded(resource: any) {
    this.onResourceLoadedWith = resource
  }
}

type Constructor = new (...args: any[]) => TestShell
const counter = new WeakMap<TestShell, number>()
function SpyMixin<B extends Constructor>(Base: B) {
  return class extends Base {
    get onResourceLoadedTimes() {
      return counter.get(this) || 0
    }

    onResourceLoaded() {
      counter.set(this, 1 + (counter.get(this) || 0))
    }
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

  it('calls onResourceLoaded', async () => {
    // given
    const model = {}
    const el = await fixture<TestShell>(
      html`
        <hydrofoil-shell .fakeModel="${model}"></hydrofoil-shell>
      `,
    )
    await el.updateComplete

    // when
    await el.loadResource('foo')

    // then
    expect(el.onResourceLoadedWith).to.be.equal(model)
  })

  it('calls onResourceLoaded from every mixin', async () => {
    // given
    @customElement('mixed-shell')
    class MixedShell extends SpyMixin(SpyMixin(SpyMixin(TestShell))) {}
    const model = {}
    const el = await fixture<MixedShell>(
      html`
        <mixed-shell .fakeModel="${model}"></mixed-shell>
      `,
    )

    // when
    await el.updateComplete

    // then
    expect(el.onResourceLoadedTimes).to.be.equal(3)
  })

  it('does not break when one onResourceLoaded fails', async () => {
    // given
    function ThrowingMixin<B extends Constructor>(Base: B) {
      return class extends Base {
        // eslint-disable-next-line class-methods-use-this
        onResourceLoaded() {
          throw new Error('should not break')
        }
      }
    }
    @customElement('throwing-shell')
    class MixedShell extends ThrowingMixin(SpyMixin(SpyMixin(SpyMixin(TestShell)))) {}
    const model = {}
    const el = await fixture<MixedShell>(
      html`
        <throwing-shell .fakeModel="${model}"></throwing-shell>
      `,
    )

    // when
    await el.updateComplete

    // then
    expect(el.onResourceLoadedTimes).to.be.equal(3)
  })
})
