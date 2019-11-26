import {
  css,
  CSSResult,
  CSSResultArray,
  html,
  LitElement,
  property,
  PropertyValues,
} from 'lit-element'
import { ResourceScope, StateMapper } from 'ld-navigation'
import { getAllImplementationsOf } from '@tpluscode/all-implementations-of'
import notify from './lib/notify'
import '@lit-any/views/lit-view'

type ConsoleState = 'ready' | 'loaded' | 'error'

/**
 * Base element class which manages top-level application state, routes the application by binding the browser location
 * with back-end resource identifier.
 *
 * On its own it does not interact with the server nor does it render any shell UI.
 *
 * @customElement
 */
export class HydrofoilShell extends ResourceScope(LitElement) {
  /**
   * @returns {CSSResult}
   */
  public static get styles(): CSSResult | CSSResultArray {
    return css`
      :host {
        display: block;
        margin: 0;
      }
      [hidden] {
        display: none;
      }
    `
  }
  /**
   * Dispatched when the model has been loaded
   *
   * @event model-changed
   */

  /**
   * Dispatched when the url has changed
   *
   * @event url-changed
   */

  /**
   * Last retrieved resource representation
   */
  @property({ type: Object, attribute: false })
  public lastResponse: any

  /**
   * Current model used for rendering
   */
  @property({ type: Object, attribute: false })
  public model?: any

  /**
   * The current resource identifier
   */
  @property({ type: String, attribute: false })
  public url?: string

  /**
   * Flag indicating that a back-end resource is currently being executed
   */
  @property({ type: Boolean, attribute: false })
  public isLoading = false

  /**
   * The current state of the console (`ready`, `loaded` or `error`)
   */
  @property({ type: String, reflect: true })
  public state: ConsoleState = 'ready'

  /**
   * Holds the last error which occurred while loading the resource
   */
  @property({ type: Object, attribute: false })
  public lastError?: Error

  /**
   * Back-end base URL to which the absolute resource path will be appended when calculating resource identifiers
   */
  @property({ type: String, attribute: 'base-url' })
  public baseUrl?: string

  /**
   * The relative app location (ie. sub-directory) which will be ignored when calculating current route.
   *
   * This should be used when an app is hosted in a virtual directory
   */
  @property({ type: String, attribute: 'client-base' })
  public clientBasePath?: string

  /**
   * Loads the resource identified by the given URL
   *
   * @param url {string}
   * @returns {Promise}
   */
  public async loadResource(url: string) {
    if (!url) {
      return
    }

    try {
      await this.updateComplete
      this.isLoading = true
      const resource = await this.loadResourceInternal(url)

      this.lastResponse = resource
      this.state = resource ? 'loaded' : 'ready'
      this.isLoading = false

      if (resource) {
        getAllImplementationsOf(this, 'onResourceLoaded').forEach(fn => fn.call(this, resource))
      }
    } catch (e) {
      console.error(e)
      this.lastError = e
      this.state = 'error'
      this.isLoading = false
    }
  }

  createStateMapper() {
    return new StateMapper({
      baseUrl: this.baseUrl,
      clientBasePath: this.clientBasePath,
      useHashFragment: this.usesHashFragment,
    })
  }

  protected updated(props: PropertyValues) {
    super.updated(props)
    notify(this, props, 'url')
  }

  /**
   * When implemented in a derived class, returns a promise which load the resource from back-end
   *
   * @template TModel
   * @param url {string} The resource identifier
   * @returns {Promise<TModel>}
   */
  // eslint-disable-next-line class-methods-use-this
  protected loadResourceInternal<T>(url: string): Promise<any> {
    throw new Error('Method not implemented')
  }

  protected render() {
    return html`
      <section id="ready" ?hidden="${this.state !== 'ready'}">
        <slot></slot>
      </section>

      <section id="main" ?hidden="${this.state !== 'loaded'}">
        ${this.renderMain()}
      </section>

      <section id="error" ?hidden="${this.state !== 'error'}">
        ${this.renderError()}
      </section>
    `
  }

  /**
   * Renders the contents of last error was caught in the shell
   *
   * @returns {TemplateResult}
   */
  protected renderError() {
    return html`
      <pre>${this.lastError && this.lastError.stack}</pre>
    `
  }

  /**
   * Renders a lit-view element to render the main model.
   *
   * By default uses `hydrofoil-shell` and ignores missing templates.
   *
   * @returns {TemplateResult}
   */
  protected renderMain() {
    return html`
      <lit-view .value="${this.model}" ignore-missing template-scope="hydrofoil-shell"></lit-view>
    `
  }

  onResourceUrlChanged(newValue: string) {
    if (newValue !== '/') {
      this.url = newValue
      this.loadResource(newValue)
    }
  }
}
