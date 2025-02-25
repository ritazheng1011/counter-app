/**
 * Copyright 2025 rita
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 *
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.count = 16;
    this.min = 10;
    this.max = 25;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      count: { type: Number, reflect: true },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-default-roarLight);
          background-color: var(--ddd-theme-default-shrineTan);
          font-family: var(--ddd-font-navigation);
        }
        :host([count="18"]) {
          color: var(--ddd-theme-default-forestGreen);
        }
        :host([count="21"]) {
          color: var(--ddd-theme-default-forestGreen);
        }
        :host([count="10"]) {
          color: var(--ddd-theme-default-original87Pink);
        }
        :host([count="25"]) {
          color: var(--ddd-theme-default-original87Pink);
        }
        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        .counter {
          font-size: var(
            --counter-app-label-font-size,
            var(--ddd-font-size-xxl)
          );
        }
      `,
    ];
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("count")) {
      console.log("count changed to: ", this.count);
      if (this.count === 21) {
        this.makeItRain();
      }
    }
  }

  makeItRain() {
    // this is called a dynamic import. It means it won't import the code for confetti until this method is called
    // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
    // will only run AFTER the code is imported and available to us
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        // This is a minor timing 'hack'. We know the code library above will import prior to this running
        // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
        // this "hack" ensures the element has had time to process in the DOM so that when we set popped
        // it's listening for changes so it can react
        setTimeout(() => {
          // forcibly set the poppped attribute on something with id confetti
          // while I've said in general NOT to do this, the confetti container element will reset this
          // after the animation runs so it's a simple way to generate the effect over and over again
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }

  // Lit render the HTML
  render() {
    return html`
      <confetti-container id="confetti" class="wrapper">
        <div class="counter">${this.count}</div>
        <div class="buttons">
          <button
            @click="${this.decrease}"
            ?disabled="${this.count === this.min}"
          >
            -1
          </button>
          <button @click="${this.increase}" ?disabled="${this.isMax()}">
            +1
          </button>
        </div>
      </confetti-container>
    `;
  }

  isMax() {
    return this.count === this.max;
  }

  increase() {
    this.count++;
  }
  decrease() {
    this.count--;
  }
  reset() {
    this.count = 16;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);
