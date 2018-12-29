import {customElement, property} from '@polymer/lit-element'
import {HydraResource} from 'alcaeus/types/Resources'

import {HydrofoilShellBase} from './hydrofoil-shell-base'
import notify from './lib/notify'

function checkId(value, old) {
    return !old || old.id !== value.id
}

@customElement('hydrofoil-shell')
export class HydrofoilShell extends HydrofoilShellBase<HydraResource> {
    @property({ type: Object, hasChanged: checkId })
    public entrypoint: HydraResource

    @property({ type: Object, attribute: false, hasChanged: checkId })
    protected resource: HydraResource

    public connectedCallback() {
        super.connectedCallback()
        this.addEventListener('model-changed', () => {
            if (this.model && this.model.apiDocumentation) {
                this.model.apiDocumentation.loadEntrypoint()
                    .then((entrypoint) => {
                        this.entrypoint = entrypoint.root
                    })
                    .catch(() => {
                        console.error('failed to load entrypoint')
                    })
            }
        })
    }

    public updated(props) {
        super.updated(props)
        notify(this, props, 'entrypoint')
    }

    protected async loadResourceInternal(url) {
        const alcaeus = await import('alcaeus')
        const hr = await alcaeus.Hydra.loadResource(url)
        return hr.root
    }

    protected areSame(left, right) {
        return left.id === right.id
    }
}
