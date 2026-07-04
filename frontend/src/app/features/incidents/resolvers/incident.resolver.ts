import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';

import { IncidentRepositoryPort } from '../application';
import { Incident, parseIncidentId } from '../domain/incident';

export const incidentResolver: ResolveFn<Incident | RedirectCommand> = async (route) => {
  const incidentRepository = inject(IncidentRepositoryPort);
  const router = inject(Router);
  const rawIncidentId = route.paramMap.get('incidentId');

  if (!rawIncidentId) {
    return new RedirectCommand(router.parseUrl('/not-found'));
  }

  try {
    const incidentId = parseIncidentId(rawIncidentId);
    const incident = await incidentRepository.findById(incidentId);
    return incident ?? new RedirectCommand(router.parseUrl('/not-found'));
  } catch {
    return new RedirectCommand(router.parseUrl('/not-found'));
  }
};
