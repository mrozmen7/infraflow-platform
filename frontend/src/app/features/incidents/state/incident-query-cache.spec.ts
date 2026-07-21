import type { Incident, IncidentPage, IncidentQuery } from '../domain/incident';

import { IncidentQueryCache } from './incident-query-cache';

const query: IncidentQuery = {
  searchTerm: 'Tunnel',
  severity: 'All',
  page: 0,
  size: 20,
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

const result: IncidentPage = {
  incidents,
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
};

describe('IncidentQueryCache characterization', () => {
  it('reuses a fresh result for the same case-insensitive query', () => {
    let now = 1_000;
    const cache = new IncidentQueryCache(30_000, () => now);

    const stored = cache.set(query, result);
    now = 30_999;

    expect(stored).toEqual({ result, loadedAt: 1_000 });
    expect(
      cache.get({ searchTerm: 'tunnel', severity: 'All', page: 0, size: 20 }),
    ).toEqual(stored);
  });

  it('caches each page of the same filters under its own key', () => {
    const cache = new IncidentQueryCache(30_000, () => 1_000);
    const secondPage: IncidentPage = { ...result, page: 1 };

    cache.set(query, result);
    cache.set({ ...query, page: 1 }, secondPage);

    expect(cache.get(query)?.result).toEqual(result);
    expect(cache.get({ ...query, page: 1 })?.result).toEqual(secondPage);
  });

  it('expires a result when its time-to-live boundary is reached', () => {
    let now = 1_000;
    const cache = new IncidentQueryCache(30_000, () => now);

    cache.set(query, result);
    now = 31_000;

    expect(cache.get(query)).toBeUndefined();
    expect(cache.get(query)).toBeUndefined();
  });

  it('deletes one query without invalidating another query', () => {
    const cache = new IncidentQueryCache(30_000, () => 1_000);
    const criticalQuery: IncidentQuery = {
      searchTerm: 'Tunnel',
      severity: 'Critical',
      page: 0,
      size: 20,
    };

    cache.set(query, result);
    cache.set(criticalQuery, result);
    cache.delete(query);

    expect(cache.get(query)).toBeUndefined();
    expect(cache.get(criticalQuery)?.result.incidents).toEqual(incidents);
  });

  it('clears every cached query after a state-changing command', () => {
    const cache = new IncidentQueryCache(30_000, () => 1_000);
    const criticalQuery: IncidentQuery = {
      searchTerm: '',
      severity: 'Critical',
      page: 0,
      size: 20,
    };

    cache.set(query, result);
    cache.set(criticalQuery, result);
    cache.clear();

    expect(cache.get(query)).toBeUndefined();
    expect(cache.get(criticalQuery)).toBeUndefined();
  });
});
