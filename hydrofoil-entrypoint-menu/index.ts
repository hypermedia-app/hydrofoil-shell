import {computed, customElement, observe, property} from '@polymer/decorators'
import {html, PolymerElement} from '@polymer/polymer'
import {HydraResource} from 'alcaeus/types/Resources'
import {Helpers} from 'LdNavigation/ld-navigation'

import '@polymer/iron-collapse'
import '@polymer/paper-icon'
import '@polymer/paper-item'
import '@polymer/paper-listbox'
import '@polymer/polymer/lib/elements/dom-repeat'

// @ts-ignore
import template from './template.html'

@customElement('hydrofoil-entrypoint-menu')
export default class extends PolymerElement {
    @property({ type: Object })
    public resource: HydraResource

    @property({ type: Object })
    public readonly entrypoint: HydraResource

    @property({ type: Boolean })
    public opened: boolean = true

    @computed('opened')
    get openCloseText() {
        return this.opened ? 'close' : 'open'
    }

    @computed('opened')
    get icon() {
        return this.opened ? 'expand-less' : 'expand-more'
    }

    private toggle() {
        this.opened = !this.opened
    }

    private load(e: any) {
        Helpers.fireNavigation(this, this.entrypoint[e.model.link.property.id].id)
    }

    static get template() {
        return html([`${template}`] as any)
    }
}
