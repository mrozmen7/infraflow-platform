package com.infraflow.platform.workorders.web;

import com.infraflow.platform.shared.kernel.IncidentId;
import com.infraflow.platform.workorders.application.DraftWorkOrderCommand;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record DraftWorkOrderRequest(
  @Schema(example = "INC-2026-0001")
  @NotBlank @Pattern(regexp = "INC-\\d{4}-\\d{4}") String incidentId
) {

  DraftWorkOrderCommand toCommand() {
    return new DraftWorkOrderCommand(new IncidentId(incidentId));
  }
}
