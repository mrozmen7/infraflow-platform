package com.infraflow.platform.incidents;

import static org.assertj.core.api.Assertions.assertThat;

import com.infraflow.platform.incidents.application.IncidentRepository;
import com.infraflow.platform.incidents.domain.IncidentId;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import com.infraflow.platform.support.PostgresIntegrationTest;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class IncidentIdentityGenerationTests extends PostgresIntegrationTest {

  @Autowired
  private IncidentRepository incidentRepository;

  @Test
  void generatesSequentialIncidentIdsFromDatabaseSequence() {
    IncidentId first = incidentRepository.nextIdentity();
    IncidentId second = incidentRepository.nextIdentity();

    int year = java.time.Year.now().getValue();
    assertThat(first.value()).isEqualTo("INC-%d-1000".formatted(year));
    assertThat(second.value()).isEqualTo("INC-%d-1001".formatted(year));
  }
}
