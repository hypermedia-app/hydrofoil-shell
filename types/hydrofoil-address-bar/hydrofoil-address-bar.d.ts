import { PolymerElement } from '@polymer/polymer';
import '@polymer/iron-a11y-keys/iron-a11y-keys';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/av-icons';
import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button/paper-icon-button';
import { PaperInputElement } from '@polymer/paper-input/paper-input';
export default class HydrofoilAddressBar extends PolymerElement {
    urlInput: PaperInputElement;
    url: string;
    static readonly template: HTMLTemplateElement;
}
