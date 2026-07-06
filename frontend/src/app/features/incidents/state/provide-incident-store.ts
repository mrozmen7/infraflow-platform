import type { Provider } from '@angular/core';

import { IncidentStore } from './incident-store';

export function provideIncidentStore(): Provider {
  return IncidentStore;
}
