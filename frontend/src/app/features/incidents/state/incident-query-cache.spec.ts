import type { Incident, IncidentQuery } from '../domain/incident';

import { IncidentQueryCache } from './incident-query-cache';

const query: IncidentQuery = {
  searchTerm: 'Tunnel',
  severity: 'All',
};

const incidents: readonly Incident[] = [
  {
    id: 'INC-CACHE-001',
    title: 'Ventilation inspection due',
    description: 'The scheduled inspection is waiting for confirmation.',
    location: 'North Tunnel',
    assetId: 'FAN-NT-001',
    reportedAt: '2026-07-06T08:00:00.000Z',
    severity: 'Medium',
    priority: 'P3',
    status: 'Acknowledged',
    operationalSignals: ['Inspection overdue'],
  },
];

describe('IncidentQueryCache characterization', () => {
  it('reuses a fresh result for the same case-insensitive query', () => {
    let now = 1_000;
    const cache = new IncidentQueryCache(30_000, () => now);

    const stored = cache.set(query, incidents);
    now = 30_999;

    expect(stored).toEqual({ incidents, loadedAt: 1_000 });
    expect(
      cache.get({ searchTerm: 'tunnel', severity: 'All' }),
    ).toEqual(stored);
  });

  it('expires a result when its time-to-live boundary is reached', () => {
    let now = 1_000;
    const cache = new IncidentQueryCache(30_000, () => now);

    cache.set(query, incidents);
    now = 31_000;

    expect(cache.get(query)).toBeUndefined();
    expect(cache.get(query)).toBeUndefined();
  });

  it('deletes one query without invalidating another query', () => {
    const cache = new IncidentQueryCache(30_000, () => 1_000);
    const criticalQuery: IncidentQuery = {
      searchTerm: 'Tunnel',
      severity: 'Critical',
    };

    cache.set(query, incidents);
    cache.set(criticalQuery, incidents);
    cache.delete(query);

    expect(cache.get(query)).toBeUndefined();
    expect(cache.get(criticalQuery)?.incidents).toEqual(incidents);
  });

  it('clears every cached query after a state-changing command', () => {
    const cache = new IncidentQueryCache(30_000, () => 1_000);
    const criticalQuery: IncidentQuery = {
      searchTerm: '',
      severity: 'Critical',
    };

    cache.set(query, incidents);
    cache.set(criticalQuery, incidents);
    cache.clear();

    expect(cache.get(query)).toBeUndefined();
    expect(cache.get(criticalQuery)).toBeUndefined();
  });
});
