export default function (fn: () => {}, time: number) {
    let timeout: number

    return function (): void {
        const functionCall = () => fn.apply(this, [ ...arguments ])

        clearTimeout(timeout)
        timeout = window.setTimeout(functionCall, time)
    }
}
