import { MockIncidentRepository } from './mock-incident-repository';

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

  it('persists an acknowledgement inside the route-scoped fake repository', async () => {
    const repository = new MockIncidentRepository();

    await repository.acknowledge('INC-2026-0001');
    const incident = await repository.findById('INC-2026-0001');

    expect(incident?.status).toBe('Acknowledged');
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
