export default function(element, props, name) {
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
