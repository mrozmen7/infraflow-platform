create table assets (
  id varchar(40) primary key,
  name varchar(160) not null,
  type varchar(80) not null,
  location varchar(160) not null,
  criticality varchar(20) not null,
  status varchar(30) not null,
  last_inspected_at timestamp with time zone not null,
  constraint assets_criticality_check check (criticality in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  constraint assets_status_check check (status in ('OPERATIONAL', 'DEGRADED', 'MAINTENANCE', 'OUT_OF_SERVICE'))
);

create index idx_assets_location on assets(location);
create index idx_assets_status on assets(status);

insert into assets (id, name, type, location, criticality, status, last_inspected_at) values
  ('TRF-NT-003', 'North tunnel transformer 3', 'Transformer', 'North Tunnel · KM 3.0', 'CRITICAL', 'DEGRADED', '2026-06-29T06:30:00Z'),
  ('SNS-WT-118', 'West tunnel ventilation sensor 118', 'Air-flow sensor', 'West Tunnel · Ventilation Zone B', 'HIGH', 'DEGRADED', '2026-06-30T12:00:00Z'),
  ('TEL-ST-012', 'South tunnel emergency phone 12', 'Emergency phone', 'South Tunnel · Bay 12', 'MEDIUM', 'OPERATIONAL', '2026-06-15T09:00:00Z');
