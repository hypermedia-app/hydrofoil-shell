import { computed, customElement, listen, observe, property, query } from '@polymer/decorators'
import { DeclarativeEventListeners } from '@polymer/decorators/lib/declarative-event-listeners.js'
import { microTask } from '@polymer/polymer/lib/utils/async'
import { Debouncer } from '@polymer/polymer/lib/utils/debounce'
import { HydraResource } from 'alcaeus/types/Resources'

import { html, PolymerElement } from '@polymer/polymer/polymer-element'
// @ts-ignore
import template from './template.html'

import '@polymer/app-layout'
import '@polymer/iron-icon/iron-icon'
import '@polymer/iron-icons/iron-icons'
import '@polymer/iron-pages/iron-pages'
import '@polymer/paper-spinner/paper-spinner'
import '@polymer/paper-styles/default-theme'
import '@polymer/paper-styles/paper-styles'
import '@polymer/paper-styles/typography'
import '@polymer/polymer/lib/elements/dom-if'
import 'ld-navigation/ld-navigator'

import {AppDrawerElement} from '@polymer/app-layout/app-drawer/app-drawer'
import fireNavigation from 'ld-navigation/fireNavigation'
import '../loading-overlay/loading-overlay'

type ConsoleState = 'ready' | 'loaded' | 'error' | 'operation'

export default abstract class HydrofoilOldShell extends DeclarativeEventListeners(PolymerElement) {
    @computed('model')
    get hasApiDocumentation() {
        return !!this.model && !!this.model.apiDocumentation
    }

    @computed('currentModel')
    get displayedModel(): HydraResource {
        // @ts-ignore
        return this.currentModel.collection || this.currentModel
    }

    static get template() {
        return html([`${template}`] as any)
    }

    @computed('currentModel')
    get links() {
        return this.currentModel.apiDocumentation
            .getProperties(this.currentModel.types[0])
            .filter((sp) => {
                return sp.property.types.indexOf('http://www.w3.org/ns/hydra/core#Link') !== -1
            })
    }

    @property({ type: Object })
    public model: HydraResource = null

    @property({ type: String })
    public url: string

    @property({ type: Object })
    public currentModel: HydraResource

    @property({ type: Object, readOnly: true })
    public readonly entrypoint: HydraResource

    @property({ type: Object, readOnly: true })
    public readonly lastError: Error

    @property({ type: String, notify: true })
    public state: ConsoleState = 'ready'

    @property({ type: Boolean })
    protected showAddressBar: boolean

    @property({ type: Boolean, readOnly: true, notify: true })
    private readonly isLoading: boolean = false

    @query('#documentation')
    private documentationDrawer: AppDrawerElement

    private prevState: ConsoleState

    public hasPreviousModel(modelHistory: any) {
        return modelHistory.base.length > 0
    }

    public showDocs() {
        this.documentationDrawer.open()
    }

    public load() {
        this._setProperty('isLoading', true)
        fireNavigation(this, this.url)
    }

    public showModel(ev: CustomEvent) {
        this.push('_modelHistory', this.currentModel)
        this.currentModel = ev.detail
    }

    @listen('show-class-documentation', document)
    public async showDocumentation(e: CustomEvent) {
        /*await import('../../api-documentation/viewer/viewer')

        this.$.apiDocumentation.selectClass(e.detail.classId)
        this.showDocs()*/

        e.stopPropagation()
    }

    @listen('show-inline-resource', document)
    public showResource(e: CustomEvent) {
        this.currentModel = e.detail.resource
    }

    @listen('show-resource-json', document)
    public async showResourceJson(e: CustomEvent) {
        /*await import('../../resource-views/resource-json')

        this.$.source.resource = e.detail.resource
        this.$.source.show()*/
    }

    public hideOperationForm() {
        this.state = this.prevState || 'ready'
    }

    @observe('currentModel')
    private getEntrypoint(resource: HydraResource) {
        resource.apiDocumentation.loadEntrypoint()
            .then((entrypoint) => {
                this._setProperty('entrypoint', entrypoint.root)
            })
            .catch(() => {
                this._setProperty('entrypoint', {})
            })
    }

    private async loadResource(value: string) {
        const alcaeus = await import('alcaeus')

        try {
            const hr = await alcaeus.Hydra.loadResource(value)
            const res = hr.root

            this.model = res
            this.currentModel = res
            this.state = 'loaded'
            this._setProperty('isLoading', false)

            import('../hydrofoil-entrypoint-menu')
            import('@lit-any/lit-any/lit-view')
        } catch (err) {
            this._setProperty('lastError', err)
            this.state = 'error'
            this._setProperty('isLoading', false)
        }
    }

    @observe('showAddressBar')
    private showAddressBarChanges(showAddressBar) {
        if (showAddressBar) {
            import('../hydrofoil-address-bar')
        }
    }

    private urlChanged(e: CustomEvent) {
        Debouncer.debounce(
            null,
            microTask,
            () => {
                if (e.detail.value !== '/') {
                    this.url = e.detail.value
                    this._setProperty('isLoading', true)
                    this.loadResource(this.url)
                }
            })
    }

    private _loadDocElements(e: CustomEvent) {
        if (e.detail.value === true) {
            // import('../../api-documentation/viewer/viewer')
        }
    }

    private howOperationForm(e: CustomEvent) {
        if (e.detail.operation.requiresInput === false) {
            e.detail.operation.invoke()
        } else {
            this.prevState = this.state
            this.state = 'operation'
        }
    }
}
