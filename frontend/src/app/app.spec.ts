import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { App } from './app';

@Component({ template: '<h1>Test page</h1>' })
class TestPage {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([{ path: 'test', component: TestPage }])],
    }).compileComponents();
  });

  it('creates the accessible application shell', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance).toBeTruthy();
    expect(element.querySelector('.skip-link')?.getAttribute('href')).toBe('#main-content');
    expect(element.querySelector('nav')?.textContent).toContain('Incidents');
    expect(element.querySelector('router-outlet')).toBeTruthy();
    expect(element.querySelector('main')?.getAttribute('tabindex')).toBe('-1');
  });

  it('moves keyboard focus to main content after route activation', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    await TestBed.inject(Router).navigateByUrl('/test');
    await fixture.whenStable();

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('main'));
  });
});
