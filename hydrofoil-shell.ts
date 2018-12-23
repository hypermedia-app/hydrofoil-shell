import {customElement, property} from '@polymer/lit-element'
import {HydraResource} from 'alcaeus/types/Resources'

import {HydrofoilShellBase} from './hydrofoil-shell-base'

@customElement('hydrofoil-shell')
export class HydrofoilShell extends HydrofoilShellBase<HydraResource> {
    public get entrypoint(): Promise<HydraResource> {
        return new Promise((resolve) => {
            this.addEventListener('model-changed', () => {
                resolve(this.model)
            })
        })
        .then((resource: HydraResource) => resource.apiDocumentation.loadEntrypoint())
        .then((response) => response.root)
        .catch(() => null)
    }

    @property({ type: Object, attribute: false })
    protected resource: HydraResource

    public connectedCallback() {
        super.connectedCallback()
        /*this.addEventListener('model-changed', () => {
            this enntrypoint = this.loadEntryPoint()
        })*/
    }

    protected async loadResourceInternal(url) {
        const alcaeus = await import('alcaeus')
        const hr = await alcaeus.Hydra.loadResource(url)
        return hr.root
    }

    private loadEntryPoint() {
        return this.resource.apiDocumentation.loadEntrypoint()
            .then((entrypoint) => {
                return entrypoint.root
            })
            .catch(() => {
                return null
            })
    }
}
