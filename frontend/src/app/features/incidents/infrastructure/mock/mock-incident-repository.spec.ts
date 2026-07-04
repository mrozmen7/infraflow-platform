import { MockIncidentRepository } from './mock-incident-repository';
import type { Incident } from '../../domain/incident';

describe('MockIncidentRepository', () => {
  it('filters incidents by search term and severity', async () => {
    const repository = new MockIncidentRepository();

    const incidents = await repository.search({
      searchTerm: 'transformer',
      severity: 'Critical',
    });

    expect(incidents).toHaveLength(1);
    expect(incidents[0]?.id).toBe('INC-2026-0001');
  });

  it('persists an updated entity inside the route-scoped fake repository', async () => {
    const repository = new MockIncidentRepository();
    const currentIncident = await repository.findById('INC-2026-0001');

    expect(currentIncident).toBeDefined();

    await repository.save({ ...currentIncident!, status: 'Acknowledged' });
    const incident = await repository.findById('INC-2026-0001');

    expect(incident?.status).toBe('Acknowledged');
  });

  it('rejects saving an entity that does not exist in the adapter', async () => {
    const repository = new MockIncidentRepository();
    const unknownIncident: Incident = {
      id: 'INC-MISSING-001',
      title: 'Missing incident',
      description: 'Test description',
      location: 'Unknown',
      assetId: 'AST-UNKNOWN',
      reportedAt: '2026-06-30T15:42:00.000Z',
      severity: 'Low',
      priority: 'P4',
      status: 'Open',
      operationalSignals: [],
    };

    await expect(repository.save(unknownIncident)).rejects.toThrow('was not found');
  });

  it('cancels stale searches through AbortSignal', async () => {
    const repository = new MockIncidentRepository();
    const abortController = new AbortController();
    const searchPromise = repository.search(
      { searchTerm: '', severity: 'All' },
      abortController.signal,
    );

    abortController.abort(new Error('Superseded request'));

    await expect(searchPromise).rejects.toThrow('Superseded request');
  });
});
