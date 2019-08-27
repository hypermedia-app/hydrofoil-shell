export default function (fn: () => {}, time: number) {
  let timeout: number

  return function (this: unknown, ...args: []): void {
    const functionCall = () => fn.apply(this, args)

    clearTimeout(timeout)
    timeout = window.setTimeout(functionCall, time)
  }
}
