package com.infraflow.platform.incidents;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.infraflow.platform.incidents.application.IncidentRepository;
import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentId;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class IncidentOptimisticLockingTests {

  @Autowired
  private IncidentRepository incidentRepository;

  @Test
  void rejectsStaleIncidentUpdateWithOptimisticLocking() {
    IncidentId incidentId = new IncidentId("INC-2026-0001");
    Incident firstOperatorView = incidentRepository.findById(incidentId).orElseThrow();
    Incident secondOperatorView = incidentRepository.findById(incidentId).orElseThrow();

    Incident saved = incidentRepository.save(firstOperatorView.acknowledge());

    assertThat(saved.version()).isGreaterThan(firstOperatorView.version());
    assertThatThrownBy(() -> incidentRepository.save(secondOperatorView.acknowledge()))
      .isInstanceOf(ObjectOptimisticLockingFailureException.class);
  }
}

