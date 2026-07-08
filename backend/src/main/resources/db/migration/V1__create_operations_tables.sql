create table incidents (
  id varchar(16) primary key,
  title varchar(120) not null,
  description varchar(1000) not null,
  location varchar(160) not null,
  asset_id varchar(40) not null,
  reported_at timestamp with time zone not null,
  severity varchar(20) not null,
  priority varchar(10) not null,
  status varchar(30) not null,
  constraint incidents_severity_check check (severity in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  constraint incidents_priority_check check (priority in ('P1', 'P2', 'P3', 'P4')),
  constraint incidents_status_check check (status in ('OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'))
);

create table incident_operational_signals (
  incident_id varchar(16) not null references incidents(id) on delete cascade,
  signal_order integer not null,
  signal varchar(120) not null,
  primary key (incident_id, signal_order)
);

create table work_orders (
  id varchar(16) primary key,
  incident_id varchar(16) not null references incidents(id),
  title varchar(180) not null,
  description varchar(1000) not null,
  asset_id varchar(40) not null,
  location varchar(160) not null,
  priority varchar(10) not null,
  status varchar(30) not null,
  created_at timestamp with time zone not null,
  constraint work_orders_priority_check check (priority in ('P1', 'P2', 'P3', 'P4')),
  constraint work_orders_status_check check (status in ('DRAFT', 'READY', 'IN_PROGRESS', 'DONE'))
);

create index idx_incidents_status on incidents(status);
create index idx_incidents_severity on incidents(severity);
create index idx_work_orders_incident_id on work_orders(incident_id);
