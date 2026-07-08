import type { Incident, IncidentQuery } from '../domain/incident';

export interface IncidentQueryCacheEntry {
  readonly incidents: readonly Incident[];
  readonly loadedAt: number;
}

export class IncidentQueryCache {
  private readonly entries = new Map<string, IncidentQueryCacheEntry>();

  constructor(
    private readonly timeToLiveMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  get(query: IncidentQuery): IncidentQueryCacheEntry | undefined {
    const key = this.createKey(query);
    const entry = this.entries.get(key);

    if (!entry) {
      return undefined;
    }

    if (this.now() - entry.loadedAt >= this.timeToLiveMs) {
      this.entries.delete(key);
      return undefined;
    }

    return entry;
  }

  set(
    query: IncidentQuery,
    incidents: readonly Incident[],
  ): IncidentQueryCacheEntry {
    const entry: IncidentQueryCacheEntry = {
      incidents,
      loadedAt: this.now(),
    };

    this.entries.set(this.createKey(query), entry);
    return entry;
  }

  delete(query: IncidentQuery): void {
    this.entries.delete(this.createKey(query));
  }

  clear(): void {
    this.entries.clear();
  }

  private createKey(query: IncidentQuery): string {
    return `${query.searchTerm.toLocaleLowerCase()}::${query.severity}`;
  }
}
