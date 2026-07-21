package com.infraflow.platform;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.infraflow.platform.support.PostgresIntegrationTest;

@SpringBootTest
@ActiveProfiles("test")
class InfraflowBackendApplicationTests extends PostgresIntegrationTest {

  @Test
  void contextLoads() {
  }
}
