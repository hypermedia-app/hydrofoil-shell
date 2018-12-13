import {html, PolymerElement} from '@polymer/polymer'
import {customElement, property, query} from '@polymer/decorators'

import '@polymer/iron-a11y-keys/iron-a11y-keys'
import '@polymer/iron-icon/iron-icon'
import '@polymer/iron-icons/av-icons'
import '@polymer/iron-icons/iron-icons'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-icon-button/paper-icon-button'
import {PaperInputElement} from '@polymer/paper-input/paper-input'

customElement('hydrofoil-address-bar')
export default class HydrofoilAddressBar extends PolymerElement {
    @query('#resource')
    public urlInput: PaperInputElement

    @property({ type: String})
    public url: string

    static get template() {
        return html`<paper-input main-title id="resource" class="middle" label="address"
                             pattern="^https?://.*" no-label-float auto-validate
                             invalid="{{addressInvalid}}"
                             value="{{url}}"
                             on-keydown="loadOnEnter">
                    <iron-icon slot="prefix" icon="icons:language"></iron-icon>
                </paper-input>
                <iron-a11y-keys target="[[urlInput]]" keys="enter" on-keys-pressed="onEnter"></iron-a11y-keys>
                <paper-icon-button class="middle" icon="av:play-circle-filled" disabled="[[addressInvalid]]"
                                   on-tap="load"></paper-icon-button>`
    }
}
