import {property} from 'lit-element'
import {HydraResource} from 'alcaeus/types/Resources'

import {HydrofoilShell} from './hydrofoil-shell'
import notify from './lib/notify'

function checkId(value, old) {
    return !old || old.id !== value.id
}

type Constructor<T = HydrofoilShell> = new (...args: any[]) => T;

/**
 * A base shell mixin class which uses `Alcaeus` Hydra client to load the resources
 *
 * @mixinFunction
 */
export default function<CBase extends Constructor>(Base: CBase) {
    class AlcaeusLoader extends Base {
        /**
         * Dispatched when the entrypoint has been loaded
         *
         * @event entrypoint-changed
         */

        /**
         * The Hydra entrypoint linked from the current API Documentation
         */
        @property({type: Object, hasChanged: checkId})
        public entrypoint: HydraResource

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
    }

    return AlcaeusLoader
}
