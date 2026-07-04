import { InvalidIncidentIdError, isIncidentId, parseIncidentId } from './incident-id';

describe('IncidentId', () => {
  it('accepts and returns a canonical Incident id', () => {
    expect(parseIncidentId('  INC-2026-0001  ')).toBe('INC-2026-0001');
    expect(isIncidentId('INC-TEST-001')).toBe(true);
  });

  it('rejects ids that belong to another domain or contain invalid characters', () => {
    expect(() => parseIncidentId('WO-2026-0001')).toThrow(InvalidIncidentIdError);
    expect(() => parseIncidentId('incident 1')).toThrow('Invalid Incident id');
  });
});
