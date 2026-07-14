-- A repeated browser retry must not create a second controlled response for the same incident.
alter table work_orders
  add constraint uq_work_orders_incident_id unique (incident_id);
