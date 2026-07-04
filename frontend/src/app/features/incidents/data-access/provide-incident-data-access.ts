import { Provider } from '@angular/core';

import { INCIDENT_REPOSITORY } from './incident-repository';
import { MockIncidentRepository } from './mock-incident-repository';

export function provideIncidentDataAccess(): Provider {
  return {
    provide: INCIDENT_REPOSITORY,
    useClass: MockIncidentRepository,
  };
}
