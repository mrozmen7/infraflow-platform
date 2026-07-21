package com.infraflow.platform.workorders.domain;

import com.infraflow.platform.shared.kernel.IncidentId;
import com.infraflow.platform.shared.kernel.IncidentPriority;
import com.infraflow.platform.shared.error.BusinessRuleViolationException;
import java.time.OffsetDateTime;
import java.util.Objects;

public record WorkOrder(
  WorkOrderId id,
  IncidentId incidentId,
  String title,
  String description,
  String assetId,
  String location,
  IncidentPriority priority,
  WorkOrderStatus status,
  OffsetDateTime createdAt
) {

  public WorkOrder {
    Objects.requireNonNull(id, "Work order id is required.");
    Objects.requireNonNull(incidentId, "Incident id is required.");
    Objects.requireNonNull(priority, "Priority is required.");
    Objects.requireNonNull(status, "Status is required.");
    Objects.requireNonNull(createdAt, "Created time is required.");
    title = requireText(title, "Title is required.");
    description = requireText(description, "Description is required.");
    assetId = requireText(assetId, "Asset id is required.");
    location = requireText(location, "Location is required.");
  }

  private static String requireText(String value, String message) {
    if (value == null || value.isBlank()) {
      throw new IllegalArgumentException(message);
    }

    return value.trim();
  }

  public WorkOrder moveTo(WorkOrderStatus nextStatus) {
    Objects.requireNonNull(nextStatus, "Next status is required.");

    if (!status.canTransitionTo(nextStatus)) {
      throw new BusinessRuleViolationException(
        "Work order %s cannot move from %s to %s."
          .formatted(id.value(), status.apiValue(), nextStatus.apiValue())
      );
    }

    return new WorkOrder(
      id, incidentId, title, description, assetId, location, priority, nextStatus, createdAt
    );
  }
}
