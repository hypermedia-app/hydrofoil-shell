import { computed, customElement, listen, property } from '@polymer/decorators'
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js'
import { html, PolymerElement } from '@polymer/polymer/polymer-element'

// @ts-ignore
@customElement('loading-overlay')
export default class LoadingOverlay extends mixinBehaviors(IronOverlayBehavior, PolymerElement) {
    constructor() {
        super()
        this.withBackdrop = true;
        this.noCancelOnOutsideClick = true;
        this.alwaysOnTop = true;
        this.noCancelOnEscKey = true;
        this.autoFitOnAttach = true;
    }

    static get template() {
        return html`<slot></slot>`
    }
}
