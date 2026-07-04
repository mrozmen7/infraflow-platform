import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <section class="message-page" aria-labelledby="not-found-title">
      <p class="eyebrow">404 · Route not found</p>
      <h1 id="not-found-title">This operational view does not exist.</h1>
      <p>Check the address or return to the incident workspace.</p>
      <a routerLink="/incidents">Open incidents</a>
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
      display: inline-flex;
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 0.55rem;
      color: #06252a;
      background: var(--color-accent);
      font-weight: 800;
      text-decoration: none;
    }
  `,
})
export class NotFoundPage {}
