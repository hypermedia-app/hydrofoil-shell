var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, PolymerElement } from '@polymer/polymer';
import { customElement, property, query } from '@polymer/decorators';
import '@polymer/iron-a11y-keys/iron-a11y-keys';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/av-icons';
import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button/paper-icon-button';
customElement('hydrofoil-address-bar');
export default class HydrofoilAddressBar extends PolymerElement {
    static get template() {
        return html `<paper-input main-title id="resource" class="middle" label="address"
                             pattern="^https?://.*" no-label-float auto-validate
                             invalid="{{addressInvalid}}"
                             value="{{url}}"
                             on-keydown="loadOnEnter">
                    <iron-icon slot="prefix" icon="icons:language"></iron-icon>
                </paper-input>
                <iron-a11y-keys target="[[urlInput]]" keys="enter" on-keys-pressed="onEnter"></iron-a11y-keys>
                <paper-icon-button class="middle" icon="av:play-circle-filled" disabled="[[addressInvalid]]"
                                   on-tap="load"></paper-icon-button>`;
    }
}
__decorate([
    query('#resource')
], HydrofoilAddressBar.prototype, "urlInput", void 0);
__decorate([
    property({ type: String })
], HydrofoilAddressBar.prototype, "url", void 0);
