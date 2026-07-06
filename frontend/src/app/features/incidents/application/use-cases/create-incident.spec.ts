import type {
  Incident,
  IncidentId,
  IncidentQuery,
  NewIncident,
} from '../../domain/incident';
import { IncidentRepositoryPort } from '../ports/incident-repository.port';
import { createIncident, InvalidNewIncidentError } from './create-incident';

class CapturingIncidentRepository implements IncidentRepositoryPort {
  createdIncident: NewIncident | null = null;

  search(_query: IncidentQuery): Promise<readonly Incident[]> {
    return Promise.resolve([]);
  }

  findById(_incidentId: IncidentId): Promise<Incident | undefined> {
    return Promise.resolve(undefined);
  }

  save(incident: Incident): Promise<Incident> {
    return Promise.resolve(incident);
  }

  create(newIncident: NewIncident): Promise<Incident> {
    this.createdIncident = newIncident;
    return Promise.resolve({
      ...newIncident,
      id: 'INC-CREATE-001',
      reportedAt: '2026-07-04T10:00:00.000Z',
      status: 'Open',
    });
  }
}

const newIncident: NewIncident = {
  title: '  North Tunnel ventilation stopped  ',
  description: '  The ventilation unit no longer reports measurable airflow.  ',
  location: '  North Tunnel · KM 3.0  ',
  assetId: '  fan-nt-003  ',
  severity: 'Medium',
  priority: 'P2',
  operationalSignals: [' Airflow unavailable ', 'Traffic active', 'Traffic active', ''],
};

describe('createIncident', () => {
  it('normalizes user-entered text before crossing the repository port', async () => {
    const repository = new CapturingIncidentRepository();

    const incident = await createIncident(repository, newIncident);

    expect(repository.createdIncident).toEqual({
      title: 'North Tunnel ventilation stopped',
      description: 'The ventilation unit no longer reports measurable airflow.',
      location: 'North Tunnel · KM 3.0',
      assetId: 'FAN-NT-003',
      severity: 'Medium',
      priority: 'P2',
      operationalSignals: ['Airflow unavailable', 'Traffic active'],
    });
    expect(incident.id).toBe('INC-CREATE-001');
  });

  it('rejects empty required text even if UI validation is bypassed', () => {
    const repository = new CapturingIncidentRepository();

    expect(() =>
      createIncident(repository, {
        ...newIncident,
        title: '   ',
      }),
    ).toThrowError(new InvalidNewIncidentError('title'));
    expect(repository.createdIncident).toBeNull();
  });
});
