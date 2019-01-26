import {html, LitElement, property} from 'lit-element'

/**
 * A base element class which builds a foundation for maintaining multiple resources, such as in a hierarchical
 * or stacked view.
 *
 * Resources are added and removed from view by dispatching `hydrofoil-append-resource` and `hydrofoil-close-resource`
 * events in the children of `HydrofoilMultiResourceView`
 */
export default abstract class HydrofoilMultiResourceView extends LitElement {
    /**
     * The top-most resource model
     */
    @property({ type: Object, attribute: false })
    public root: any

    /**
     * All managed resources
     */
    @property({ type: Array, attribute: false })
    public displayedResources: any[] = []

    /**
     * The currently rendered resource
     */
    @property({ type: Object, attribute: false })
    public current: any

    public updated(props) {
        super.updated(props)
        if (props.has('root')) {
            this.displayedResources = [ this.root ]
            this.current = this.root
        }
    }

    public connectedCallback() {
        super.connectedCallback()
        this.addEventListener('hydrofoil-append-resource', (e: CustomEvent) => {
            const indexOfParent = this.displayedResources.findIndex((res) => this.areSame(res, e.detail.parent))
            const remaining = this.displayedResources.slice(0, indexOfParent + 1)
            this.displayedResources = [ ...remaining, e.detail.resource ]
            this.current = e.detail.resource
        })

        this.addEventListener('hydrofoil-close-resource', (e: CustomEvent) => {
            this.close(e.detail.resource)
        })
    }

    public render() {
        if (this.displayedResources.length === 1) {
            return this.renderModel(this.displayedResources[0])
        }

        return this.renderAll()
    }

    /**
     * Renders a single resource
     * @param model
     */
    protected renderModel(model: any) {
        return html`<lit-view .value="${model}" ignore-missing template-scope="hydrofoil-multi-resource"></lit-view>`
    }

    protected getHeader(model: any) {
        return model.title || model.id.match(/\/[^/]+\/?$/)
    }

    /**
     * When implemented in a derived class, compares two resources to prevent displaying same twice and
     * control the right order
     *
     * @return {boolean}
     */
    protected abstract areSame(left: any, right: any)

    /**
     * When implemented in derived class renders all resources by calling `renderModel` for each one currently displayed
     */
    protected abstract renderAll()

    protected close(removed: any) {
        return (e: Event) => {
            const indexOfRemoved = this.displayedResources.findIndex((res) => this.areSame(res, removed))

            this.displayedResources = this.displayedResources.slice(0, indexOfRemoved)
            if (this.displayedResources.length > 0) {
                this.current = this.displayedResources[this.displayedResources.length - 1]
            }

            e.stopPropagation()
            e.preventDefault()
        }
    }
}
