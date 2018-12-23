import {html, LitElement, property} from '@polymer/lit-element'
import debounce from './lib/debounce'

import 'ld-navigation/ld-navigator'

type ConsoleState = 'ready' | 'loaded' | 'error'

export abstract class HydrofoilShellBase<TModel> extends LitElement {
    @property({ type: Boolean, attribute: 'use-has-urls' })
    public useHashUrls: boolean

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

    protected get _style() {
        return html`<style>:host { display: block; margin: 0 }</style>`
    }

    public updated(props) {
        if (props.has('url')) {
            this.loadResource(props.get('url'))
        }
    }

    public loadResource(url) {
        this.isLoading = true

        this.loadResourceInternal(url)
            .then((model) => {
                this.model = model
                this.state = 'loaded'

                import('@lit-any/lit-any/lit-view')
                this.dispatchEvent(new CustomEvent('model-changed', {
                    detail: model,
                }))
            })
            .catch((e) => {
                this.lastError = e
                this.state = 'error'
            })

        this.isLoading = false
    }

    protected abstract loadResourceInternal(url: string): Promise<TModel>

    protected render() {
        return html`
            ${this._style}
            <ld-navigator @resource-url-changed="${this.urlChanged}"
                          use-hash-fragment="${this.useHashUrls}"></ld-navigator>
            ${this.renderMain()}`
    }

    protected renderMain() {
        return html`<lit-view .value="${this.model}" ignore-missing></lit-view>`
    }

    private urlChanged(e: CustomEvent) {
        if (e.detail.value !== '/') {
            this.loadResource(e.detail.value)
        }
    }
}
