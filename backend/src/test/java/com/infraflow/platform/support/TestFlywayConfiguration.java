package com.infraflow.platform.support;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration(proxyBeanMethods = false)
class TestFlywayConfiguration {

  /**
   * Every application context starts from an empty schema so sequence-based
   * identifiers and seed data assertions stay deterministic across test
   * classes that share the same PostgreSQL container.
   */
  @Bean
  FlywayMigrationStrategy cleanBeforeMigrateStrategy() {
    return flyway -> {
      flyway.clean();
      flyway.migrate();
    };
  }
}
