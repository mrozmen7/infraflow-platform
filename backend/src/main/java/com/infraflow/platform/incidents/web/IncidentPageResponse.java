package com.infraflow.platform.incidents.web;

import com.infraflow.platform.incidents.domain.Incident;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import org.springframework.data.domain.Page;

@Schema(description = "One page of the incident search result.")
record IncidentPageResponse(
  @Schema(description = "Incidents on the current page, ordered by the requested sort.")
  List<IncidentResponse> content,
  @Schema(description = "Zero-based index of the current page.", example = "0")
  int page,
  @Schema(description = "Requested page size.", example = "20")
  int size,
  @Schema(description = "Total number of incidents matching the filters.", example = "42")
  long totalElements,
  @Schema(description = "Total number of pages for the requested size.", example = "3")
  int totalPages
) {

  static IncidentPageResponse from(Page<Incident> incidents) {
    return new IncidentPageResponse(
      incidents.getContent().stream().map(IncidentResponse::from).toList(),
      incidents.getNumber(),
      incidents.getSize(),
      incidents.getTotalElements(),
      incidents.getTotalPages()
    );
  }
}
