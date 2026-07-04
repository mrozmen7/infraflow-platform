import { Component } from '@angular/core';

@Component({
  selector: 'app-work-orders-page',
  template: `
    <section class="placeholder" aria-labelledby="work-orders-title">
      <p>Maintenance execution · Route boundary</p>
      <h1 id="work-orders-title">Work orders</h1>
      <span
        >Work-order workflows will be connected after the Incident domain establishes its
        contracts.</span
      >
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .placeholder {
      padding: clamp(2rem, 6vw, 5rem) 0;
    }
    p {
      color: var(--color-accent);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0.65rem 0;
      font-size: clamp(2.4rem, 7vw, 5rem);
      line-height: 1;
    }
    span {
      display: block;
      max-width: 45rem;
      color: var(--color-text-muted);
      line-height: 1.65;
    }
  `,
})
export class WorkOrdersPage {}
