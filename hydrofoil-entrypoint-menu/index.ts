import {computed, customElement, observe, property} from '@polymer/decorators'
import {html, PolymerElement} from '@polymer/polymer'
import {HydraResource} from 'alcaeus/types/Resources'

import '@polymer/iron-collapse'
import '@polymer/paper-item'
import '@polymer/paper-listbox'
import '@polymer/polymer/lib/elements/dom-repeat'

// @ts-ignore
import template from './template.html'

@customElement('hydrofoil-entrypoint-menu')
export default class extends PolymerElement {
    @property({ type: Object })
    public resource: HydraResource

    @property({ type: Object, readOnly: true })
    public readonly entrypoint: HydraResource

    @computed('entrypoint')
    get links() {
        return this.entrypoint.apiDocumentation
            .getProperties(this.entrypoint.types[0])
            .filter((sp) => {
                return sp.property.types.indexOf('http://www.w3.org/ns/hydra/core#Link') !== -1
            })
    }

    @observe('resource')
    private getEntrypoint(resource: HydraResource) {
        resource.apiDocumentation.loadEntrypoint()
            .then((entrypoint) => {
                this._setProperty('entrypoint', entrypoint.root)
            })
            .catch(() => {
                this._setProperty('entrypoint', {})
            })
    }

    static get template() {
        return html([` <style>:host { display: block }</style> ${template}`] as any)
    }
}
