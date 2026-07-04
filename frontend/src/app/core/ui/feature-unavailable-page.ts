import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-feature-unavailable-page',
  imports: [RouterLink],
  template: `
    <section class="message-page" aria-labelledby="feature-title">
      <p class="eyebrow">Feature flag · Disabled</p>
      <h1 id="feature-title">Incidents are temporarily unavailable.</h1>
      <p>
        The route guard redirected this request because the runtime configuration disabled the
        feature.
      </p>
      <a routerLink="/assets">Open assets</a>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .message-page {
      max-width: 42rem;
      padding: clamp(2rem, 6vw, 5rem) 0;
    }
    .eyebrow {
      color: var(--color-accent);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0.75rem 0;
      font-size: clamp(2rem, 6vw, 4rem);
      line-height: 1.05;
    }
    p {
      color: var(--color-text-muted);
      line-height: 1.65;
    }
    a {
      color: var(--color-accent);
      font-weight: 800;
    }
  `,
})
export class FeatureUnavailablePage {}
