declare module '@morbidick/lit-element-notify/notify' {
    import {LitElement} from 'lit-element'

    type Constructor<T> = new (...args: any[]) => T

    export function LitNotify<B extends Constructor<LitElement>>(Base: B): {
        new(...args: any[]): {},
    } & B
}
