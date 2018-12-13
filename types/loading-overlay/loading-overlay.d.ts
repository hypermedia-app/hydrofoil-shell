declare const LoadingOverlay_base: any;
export default class LoadingOverlay extends LoadingOverlay_base {
    readonly withBackdrop: boolean;
    readonly noCancelOnOutsideClick: boolean;
    readonly alwaysOnTop: boolean;
    readonly noCancelOnEscKey: boolean;
    readonly autoFitOnAttach: boolean;
    static readonly template: HTMLTemplateElement;
}
export {};
