import type { Provider } from '@angular/core';

import { IncidentRepositoryPort } from '../../application';
import { MockIncidentRepository } from '../mock/mock-incident-repository';

export function provideIncidentDataAccess(): Provider {
  return {
    provide: IncidentRepositoryPort,
    useClass: MockIncidentRepository,
  };
}
