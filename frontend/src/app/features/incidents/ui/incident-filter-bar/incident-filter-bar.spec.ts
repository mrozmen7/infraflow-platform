import { TestBed } from '@angular/core/testing';

import { provideTranslateTesting, useEnglishTranslations } from '../../../../../testing/translate-testing';
import { IncidentFilterBar } from './incident-filter-bar';

describe('IncidentFilterBar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentFilterBar],
      providers: [...provideTranslateTesting()],
    }).compileComponents();

    useEnglishTranslations();
  });

  it('emits typed filter changes', async () => {
    const fixture = TestBed.createComponent(IncidentFilterBar);
    fixture.componentRef.setInput('searchTerm', 'tunnel');
    fixture.componentRef.setInput('severity', 'All');
    fixture.detectChanges();
    await fixture.whenStable();

    let searchValue = '';
    let severityValue = '';
    fixture.componentInstance.searchTermChanged.subscribe((value) => (searchValue = value));
    fixture.componentInstance.severityChanged.subscribe((value) => (severityValue = value));

    const element = fixture.nativeElement as HTMLElement;
    const searchInput = element.querySelector<HTMLInputElement>('input');
    const severitySelect = element.querySelector<HTMLSelectElement>('select');

    if (searchInput && severitySelect) {
      searchInput.value = 'transformer';
      searchInput.dispatchEvent(new Event('input'));
      severitySelect.value = 'Critical';
      severitySelect.dispatchEvent(new Event('change'));
    }

    expect(searchValue).toBe('transformer');
    expect(severityValue).toBe('Critical');
  });
});
