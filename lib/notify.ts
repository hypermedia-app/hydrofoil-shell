import { LitElement, PropertyValues } from 'lit-element'

export default function (element: LitElement & any, props: PropertyValues, name: string) {
  if (props.has(name)) {
    element.dispatchEvent(new CustomEvent(`${name}-changed`, {
      bubbles: false,
      composed: true,
      detail: {
        value: element[name],
      },
    }))
  }
}
