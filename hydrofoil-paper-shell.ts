import {customElement, html} from '@polymer/lit-element'
import {until} from 'lit-html/directives/until'
import {HydrofoilShell} from './hydrofoil-shell'

import '@polymer/app-layout/app-layout'
import '@polymer/iron-pages/iron-pages'
import '@polymer/paper-spinner/paper-spinner'
import './loading-overlay/loading-overlay'

@customElement('hydrofoil-paper-shell')
export class HydrofoilPaperShell extends HydrofoilShell {
    protected get _style() {
        return html`
            ${super._style}
            <style>
                :host {
                    --app-drawer-width: 350px;
                }

                #api-docs-container {
                    padding: 10px;
                }

                app-toolbar, ::slotted(app-toolbar) {
                    background: var(--paper-blue-400);
                    color: white;
                    @apply(--paper-font-common-base);
                }

                #spinner-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                side-menu {
                    height: calc(100% - 128px);
                    overflow: auto;
                }
            </style>`
    }

    protected async renderMenu() {
        return Promise.all([
            this.entrypoint,
            import('./hydrofoil-entrypoint-menu'),
        ]).then((resovled) => {
            return html`<hydrofoil-entrypoint-menu .entrypoint="${resovled[0]}"></hydrofoil-entrypoint-menu>`
        })
    }

    protected renderMain() {
        return html`<app-drawer-layout>
        <app-drawer slot="drawer" swipe-open>
            <app-toolbar class="medium-tall">
                <div class="title">Options</div>
            </app-toolbar>

            <slot name="toolbar-left"></slot>

            ${until(this.renderMenu(), html`menu loading`)}
        </app-drawer>

        <app-drawer align="end" slot="drawer" swipe-open>
            <slot name="drawer-left"></slot>
        </app-drawer>

        <app-header-layout>
            <app-header slot="header" fixed>
                <app-toolbar>
                    <div main-title>
                        Hydra Console
                    </div>

                    <slot name="toolbar-main"></slot>
                </app-toolbar>

                <slot name="header"></slot>
            </app-header>

            <iron-pages attr-for-selected="data-state" selected="${this.state}">
                <div data-state="ready">
                    Hello
                </div>

                <div data-state="loaded">
                    ${super.renderMain()}
                </div>

                <div data-state="error">
                    An error occurred:
                    <p>${this.lastError ? this.lastError.message : ''}</p>
                    <p>${this.lastError ? this.lastError.stack : ''}</p>
                </div>
            </iron-pages>

            <loading-overlay ?opened="${this.isLoading}">
                <paper-spinner active></paper-spinner>
            </loading-overlay>
        </app-header-layout>
    </app-drawer-layout>`
    }
}
