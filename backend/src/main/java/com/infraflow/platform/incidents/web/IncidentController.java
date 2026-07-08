package com.infraflow.platform.incidents.web;

import com.infraflow.platform.incidents.application.IncidentSearchCriteria;
import com.infraflow.platform.incidents.application.IncidentService;
import com.infraflow.platform.incidents.domain.IncidentId;
import com.infraflow.platform.incidents.domain.IncidentSeverity;
import com.infraflow.platform.shared.error.ApiError;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/incidents")
@Tag(name = "Incidents", description = "Operations incident triage and workflow commands")
class IncidentController {

  private final IncidentService incidentService;

  IncidentController(IncidentService incidentService) {
    this.incidentService = incidentService;
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
  @Operation(
    summary = "Search incidents",
    description = "Returns the current incident queue filtered by free text and optional severity."
  )
  List<IncidentResponse> search(
    @Parameter(description = "Free text filter for id, asset, location or title")
    @RequestParam(defaultValue = "") String searchTerm,
    @Parameter(description = "Severity filter. Use All, Critical, High, Medium or Low.")
    @RequestParam(defaultValue = "All") String severity
  ) {
    return incidentService.search(new IncidentSearchCriteria(searchTerm, parseSeverityFilter(severity)))
      .stream()
      .map(IncidentResponse::from)
      .toList();
  }

  @GetMapping("/{incidentId}")
  @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
  @Operation(summary = "Get incident by id")
  IncidentResponse get(
    @Parameter(example = "INC-2026-0001")
    @PathVariable @Pattern(regexp = "INC-\\d{4}-\\d{4}") String incidentId
  ) {
    return IncidentResponse.from(incidentService.get(new IncidentId(incidentId)));
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
  @Operation(
    summary = "Report a new incident",
    description = "Creates a new operations incident. The initial status is Open."
  )
  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Incident created"),
    @ApiResponse(
      responseCode = "400",
      description = "Request validation failed",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    )
  })
  ResponseEntity<IncidentResponse> create(@Valid @RequestBody CreateIncidentRequest request) {
    IncidentResponse response = IncidentResponse.from(incidentService.create(request.toCommand()));

    return ResponseEntity
      .created(URI.create("/api/v1/incidents/" + response.id()))
      .body(response);
  }

  @PostMapping("/{incidentId}/acknowledge")
  @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
  @Operation(
    summary = "Acknowledge an incident",
    description = "Marks an open incident as seen by an operator without resolving the physical issue."
  )
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Incident acknowledged"),
    @ApiResponse(
      responseCode = "404",
      description = "Incident not found",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    ),
    @ApiResponse(
      responseCode = "422",
      description = "Workflow rule rejected the command",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    )
  })
  IncidentResponse acknowledge(
    @Parameter(example = "INC-2026-0001")
    @PathVariable @Pattern(regexp = "INC-\\d{4}-\\d{4}") String incidentId
  ) {
    return IncidentResponse.from(incidentService.acknowledge(new IncidentId(incidentId)));
  }

  @PostMapping("/{incidentId}/start-response")
  @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
  @Operation(
    summary = "Start response workflow",
    description = "Moves an acknowledged incident into active response coordination."
  )
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Response workflow started"),
    @ApiResponse(
      responseCode = "404",
      description = "Incident not found",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    ),
    @ApiResponse(
      responseCode = "422",
      description = "Workflow rule rejected the command",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    )
  })
  IncidentResponse startResponse(
    @Parameter(example = "INC-2026-0001")
    @PathVariable @Pattern(regexp = "INC-\\d{4}-\\d{4}") String incidentId
  ) {
    return IncidentResponse.from(incidentService.startResponse(new IncidentId(incidentId)));
  }

  @PostMapping("/{incidentId}/resolve")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(
    summary = "Resolve an incident",
    description = "Closes an incident after operational ownership and response have been verified. Admin only."
  )
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Incident resolved"),
    @ApiResponse(
      responseCode = "403",
      description = "Admin role is required",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    ),
    @ApiResponse(
      responseCode = "404",
      description = "Incident not found",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    ),
    @ApiResponse(
      responseCode = "422",
      description = "Workflow rule rejected the command",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    )
  })
  IncidentResponse resolve(
    @Parameter(example = "INC-2026-0001")
    @PathVariable @Pattern(regexp = "INC-\\d{4}-\\d{4}") String incidentId
  ) {
    return IncidentResponse.from(incidentService.resolve(new IncidentId(incidentId)));
  }

  private Optional<IncidentSeverity> parseSeverityFilter(String severity) {
    if (severity == null || severity.isBlank() || severity.equalsIgnoreCase("All")) {
      return Optional.empty();
    }

    return Optional.of(IncidentSeverity.from(severity));
  }
}
