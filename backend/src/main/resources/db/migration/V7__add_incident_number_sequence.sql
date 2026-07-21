-- Business identifiers must not depend on an in-memory application counter.
-- Starting at 1000 both preserves existing demo IDs and keeps the migration
-- portable between PostgreSQL in production and H2 in the test environment.
create sequence incident_number_sequence start with 1000 increment by 1;
