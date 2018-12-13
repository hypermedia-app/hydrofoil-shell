import { computed, customElement, listen, property } from '@polymer/decorators'
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js'
import { html, PolymerElement } from '@polymer/polymer/polymer-element'

// @ts-ignore
@customElement('loading-overlay')
export default class LoadingOverlay extends mixinBehaviors(IronOverlayBehavior, PolymerElement) {
    // @ts-ignore
    @property({ type: Boolean, readOnly: true })
    public readonly withBackdrop = true

    // @ts-ignore
    @property({ type: Boolean, readOnly: true })
    public readonly noCancelOnOutsideClick = true

    // @ts-ignore
    @property({ type: Boolean, readOnly: true })
    public readonly alwaysOnTop = true

    // @ts-ignore
    @property({ type: Boolean, readOnly: true })
    public readonly noCancelOnEscKey = true

    // @ts-ignore
    @property({ type: Boolean, readOnly: true })
    public readonly autoFitOnAttach = true

    static get template() {
        return html`<slot></slot>`
    }
}
