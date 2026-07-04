import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';

import { INCIDENT_REPOSITORY } from '../data-access/incident-repository';
import { Incident } from '../domain/incident';

export const incidentResolver: ResolveFn<Incident | RedirectCommand> = async (route) => {
  const incidentRepository = inject(INCIDENT_REPOSITORY);
  const router = inject(Router);
  const incidentId = route.paramMap.get('incidentId');

  if (!incidentId) {
    return new RedirectCommand(router.parseUrl('/not-found'));
  }

  try {
    const incident = await incidentRepository.findById(incidentId);
    return incident ?? new RedirectCommand(router.parseUrl('/not-found'));
  } catch {
    return new RedirectCommand(router.parseUrl('/not-found'));
  }
};
