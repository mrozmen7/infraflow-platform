package com.infraflow.platform.incidents.web;

import com.infraflow.platform.incidents.application.CreateIncidentCommand;
import com.infraflow.platform.incidents.domain.AssetId;
import com.infraflow.platform.incidents.domain.IncidentPriority;
import com.infraflow.platform.incidents.domain.IncidentSeverity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateIncidentRequest(
  @Schema(example = "Transformer smoke detected")
  @NotBlank @Size(max = 120) String title,
  @Schema(example = "Smoke and a burnt smell were reported near the north tunnel transformer room.")
  @NotBlank @Size(max = 1_000) String description,
  @Schema(example = "North Tunnel · KM 3.0")
  @NotBlank @Size(max = 160) String location,
  @Schema(example = "TRF-NT-003")
  @NotBlank @Size(max = 40) String assetId,
  @Schema(example = "Critical")
  @NotNull IncidentSeverity severity,
  @Schema(example = "P1")
  @NotNull IncidentPriority priority,
  @Schema(example = "[\"Smoke detected\", \"Lighting unavailable\", \"Traffic active\"]")
  List<@NotBlank @Size(max = 120) String> operationalSignals
) {

  CreateIncidentCommand toCommand() {
    return new CreateIncidentCommand(
      title,
      description,
      location,
      new AssetId(assetId),
      severity,
      priority,
      operationalSignals == null ? List.of() : operationalSignals
    );
  }
}
