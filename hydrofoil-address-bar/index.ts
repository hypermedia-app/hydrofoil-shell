import {computed, customElement, property, query} from '@polymer/decorators'
import {html, PolymerElement} from '@polymer/polymer'

import '@polymer/iron-a11y-keys/iron-a11y-keys'
import {IronA11yKeysElement} from '@polymer/iron-a11y-keys/iron-a11y-keys'
import '@polymer/iron-icon/iron-icon'
import '@polymer/iron-icons/av-icons'
import '@polymer/iron-icons/iron-icons'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/paper-input/paper-input'

@customElement('hydrofoil-address-bar')
export default class HydrofoilAddressBar extends PolymerElement {
    @property({ type: String, notify: true })
    public url: string

    @property({ type: Boolean })
    public addressInvalid: boolean

    @computed('url', 'addressInvalid')
    public get canLoad() {
        return this.url && !this.addressInvalid
    }

    public connectedCallback() {
        super.connectedCallback()
        const k = (this.$.ironKeys as IronA11yKeysElement)
        k.target = this.$.resource
    }

    private loadOnEnter(e: KeyboardEvent) {
        if (e.keyCode === 13) {
            this.load()
        }
    }

    private load() {
        this.dispatchEvent(new CustomEvent('resource-confirmed'))
    }

    static get template() {
        return html`
<style>
    :host {
        display: flex;
        --paper-input-container-color: white;
        --paper-input-container-input-color: white;
        pointer-events: auto !important;
    }

    paper-input {
        flex-grow: 1;
    }
</style>

<paper-input main-title id="resource" class="middle" label="address"
             pattern="^https?://.*" no-label-float auto-validate
             invalid="{{addressInvalid}}"
             value="{{url}}"
             on-keydown="loadOnEnter">
    <iron-icon slot="prefix" icon="icons:language"></iron-icon>
</paper-input>
<iron-a11y-keys id="ironKeys" target="[[urlInput]]" keys="enter" on-keys-pressed="loadOnEnter"></iron-a11y-keys>
<paper-icon-button class="middle" icon="av:play-circle-filled" disabled="[[!canLoad]]"
                   on-tap="load"></paper-icon-button>`
    }
}
