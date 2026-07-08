insert into incidents (
  id,
  title,
  description,
  location,
  asset_id,
  reported_at,
  severity,
  priority,
  status
) values
  (
    'INC-2026-0001',
    'Transformer smoke detected',
    'Smoke and a burnt smell were reported near the north tunnel transformer room.',
    'North Tunnel · KM 3.0',
    'TRF-NT-003',
    '2026-06-30T15:42:00Z',
    'CRITICAL',
    'P1',
    'OPEN'
  ),
  (
    'INC-2026-0002',
    'Ventilation sensor drift',
    'Air-flow readings differ from the redundant sensor by more than eight percent.',
    'West Tunnel · Ventilation Zone B',
    'SNS-WT-118',
    '2026-06-30T14:18:00Z',
    'HIGH',
    'P2',
    'IN_PROGRESS'
  ),
  (
    'INC-2026-0003',
    'Emergency phone inspection due',
    'The scheduled functional check has not yet been confirmed by the field team.',
    'South Tunnel · Bay 12',
    'TEL-ST-012',
    '2026-06-29T08:05:00Z',
    'MEDIUM',
    'P3',
    'ACKNOWLEDGED'
  );

insert into incident_operational_signals (incident_id, signal_order, signal) values
  ('INC-2026-0001', 0, 'Smoke detected'),
  ('INC-2026-0001', 1, 'Lighting unavailable'),
  ('INC-2026-0001', 2, 'Traffic active'),
  ('INC-2026-0002', 0, 'Sensor mismatch'),
  ('INC-2026-0002', 1, 'Fallback sensor active');

insert into work_orders (
  id,
  incident_id,
  title,
  description,
  asset_id,
  location,
  priority,
  status,
  created_at
) values (
  'WO-2026-0001',
  'INC-2026-0003',
  'Verify emergency phone inspection',
  'Confirm scheduled functional check with the field team.',
  'TEL-ST-012',
  'South Tunnel · Bay 12',
  'P3',
  'DRAFT',
  '2026-06-29T08:15:00Z'
);
