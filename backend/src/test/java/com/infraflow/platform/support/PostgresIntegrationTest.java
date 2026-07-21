package com.infraflow.platform.support;

import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Base class for integration tests. All subclasses share one PostgreSQL 16
 * container for the whole test JVM (singleton container pattern: started once
 * in a static initializer, reaped by Ryuk at JVM exit). Spring Boot wires the
 * datasource through {@link ServiceConnection} and Flyway applies V1–V8 on the
 * real database.
 *
 * Test classes that recreate the application context (e.g. via DirtiesContext)
 * get a freshly cleaned and migrated schema each time through
 * {@link TestFlywayConfiguration}, which preserves the isolation the suite
 * previously had from per-context in-memory databases.
 */
@Import(TestFlywayConfiguration.class)
public abstract class PostgresIntegrationTest {

  @ServiceConnection
  @SuppressWarnings("resource")
  static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

  static {
    POSTGRES.start();
  }
}
