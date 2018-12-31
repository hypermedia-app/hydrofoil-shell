import {html, LitElement, property} from '@polymer/lit-element'
import {ifDefined} from 'lit-html/directives/if-defined'

import 'ld-navigation/ld-navigator'
import notify from './lib/notify'

type ConsoleState = 'ready' | 'loaded' | 'error'

export abstract class HydrofoilShellBase<TModel> extends LitElement {
    @property({ type: Boolean, attribute: 'use-hash-urls' })
    public useHashUrls: boolean = false

    @property({ type: Object, attribute: false })
    public model: TModel

    @property({ type: String, attribute: false })
    public url: string

    @property({ type: Boolean, attribute: false })
    public isLoading: boolean = false

    @property({ type: String, reflect: true })
    public state: ConsoleState

    @property({ type: Object, attribute: false })
    public lastError: Error

    @property({ type: String, attribute: 'base-url'})
    public baseUrl: string

    @property({ type: String, attribute: 'client-base' })
    public clientBasePath: string

    protected get _style() {
        return html`<style>:host { display: block; margin: 0 }</style>`
    }

    public updated(props) {
        super.updated(props)
        notify(this, props, 'url')
    }

    public async loadResource(url) {
        if (!url) {
            return
        }

        try {
            await this.updateComplete
            this.isLoading = true
            const model = await this.loadResourceInternal(url)

            this.model = model
            this.state = 'loaded'
            this.isLoading = false

            import('@lit-any/lit-any/lit-view')
            this.dispatchEvent(new CustomEvent('model-changed', {
                detail: model,
            }))
        } catch(e) {
            this.lastError = e
            this.state = 'error'
            this.isLoading = false
        }
    }

    protected abstract loadResourceInternal(url: string): Promise<TModel>

    protected render() {
        return html`
            ${this._style}
            <ld-navigator @resource-url-changed="${this.urlChanged}"
                          base-url="${ifDefined(this.baseUrl)}"
                          client-base-path="${ifDefined(this.clientBasePath)}"
                          ?use-hash-fragment="${ifDefined(this.useHashUrls)}"></ld-navigator>
            ${this.renderMain()}`
    }

    protected renderMain() {
        return html`<lit-view .value="${this.model}" ignore-missing template-scope="hydrofoil-shell"></lit-view>`
    }

    private urlChanged(e: CustomEvent) {
        if (e.detail.value !== '/') {
            this.url = e.detail.value
            this.loadResource(e.detail.value)
        }
    }
}
