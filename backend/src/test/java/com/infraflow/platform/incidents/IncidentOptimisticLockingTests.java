package com.infraflow.platform.incidents;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.infraflow.platform.incidents.application.IncidentRepository;
import com.infraflow.platform.incidents.domain.Incident;
import com.infraflow.platform.incidents.domain.IncidentId;
import com.infraflow.platform.support.PostgresIntegrationTest;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class IncidentOptimisticLockingTests extends PostgresIntegrationTest {

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

  @Test
  void rejectsExactlyOneOfTwoConcurrentWritesAgainstRealDatabase() throws Exception {
    IncidentId incidentId = new IncidentId("INC-2026-0001");
    Incident firstOperatorView = incidentRepository.findById(incidentId).orElseThrow();
    Incident secondOperatorView = incidentRepository.findById(incidentId).orElseThrow();

    CountDownLatch readyToWrite = new CountDownLatch(2);
    AtomicInteger viewIndex = new AtomicInteger();
    List<Incident> operatorViews = List.of(firstOperatorView, secondOperatorView);
    try (var executor = Executors.newFixedThreadPool(2)) {
      Callable<Boolean> concurrentAcknowledge = () -> {
        Incident operatorView = operatorViews.get(viewIndex.getAndIncrement());
        readyToWrite.countDown();
        readyToWrite.await(10, TimeUnit.SECONDS);
        try {
          incidentRepository.save(operatorView.acknowledge());
          return true;
        } catch (ObjectOptimisticLockingFailureException exception) {
          return false;
        }
      };

      List<Future<Boolean>> outcomes = List.of(
        executor.submit(concurrentAcknowledge),
        executor.submit(concurrentAcknowledge)
      );

      long successfulWrites = 0;
      for (Future<Boolean> outcome : outcomes) {
        if (outcome.get(30, TimeUnit.SECONDS)) {
          successfulWrites++;
        }
      }

      assertThat(successfulWrites).isEqualTo(1);
      assertThat(incidentRepository.findById(incidentId).orElseThrow().version())
        .isGreaterThan(firstOperatorView.version());
    }
  }
}
