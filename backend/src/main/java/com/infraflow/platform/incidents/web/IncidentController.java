package com.infraflow.platform.incidents.web;

import com.infraflow.platform.incidents.application.IncidentSearchCriteria;
import com.infraflow.platform.incidents.application.IncidentService;
import com.infraflow.platform.incidents.domain.IncidentSeverity;
import com.infraflow.platform.shared.error.ApiError;
import com.infraflow.platform.shared.kernel.IncidentId;
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
import java.util.Optional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    operationId = "searchIncidents",
    summary = "Search incidents",
    description = "Returns a page of the incident queue filtered by free text and optional severity."
  )
  IncidentPageResponse search(
    @Parameter(description = "Free text filter for id, asset, location or title")
    @RequestParam(defaultValue = "") String searchTerm,
    @Parameter(description = "Severity filter. Use All, Critical, High, Medium or Low.")
    @RequestParam(defaultValue = "All") String severity,
    @Parameter(description = "Zero-based page index.", example = "0")
    @RequestParam(defaultValue = "0") int page,
    @Parameter(description = "Page size, clamped to 1-100.", example = "20")
    @RequestParam(defaultValue = "20") int size,
    @Parameter(
      description = "Sort as property,direction. Properties: reportedAt, title, severity, status, id.",
      example = "reportedAt,desc"
    )
    @RequestParam(defaultValue = "reportedAt,desc") String sort
  ) {
    Pageable pageable = PageRequest.of(
      Math.max(page, 0),
      Math.min(Math.max(size, 1), 100),
      parseSort(sort)
    );

    return IncidentPageResponse.from(
      incidentService.search(new IncidentSearchCriteria(searchTerm, parseSeverityFilter(severity)), pageable)
    );
  }

  @GetMapping("/{incidentId}")
  @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
  @Operation(operationId = "getIncident", summary = "Get incident by id")
  IncidentResponse get(
    @Parameter(example = "INC-2026-0001")
    @PathVariable @Pattern(regexp = "INC-\\d{4}-\\d{4}") String incidentId
  ) {
    return IncidentResponse.from(incidentService.get(new IncidentId(incidentId)));
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
  @Operation(
    operationId = "createIncident",
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
    operationId = "acknowledgeIncident",
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
      responseCode = "409",
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
    operationId = "startIncidentResponse",
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
      responseCode = "409",
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
    operationId = "resolveIncident",
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
      responseCode = "409",
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

  private Sort parseSort(String sort) {
    String[] parts = (sort == null ? "" : sort).split(",", -1);
    String property = parts.length > 0 ? parts[0].trim() : "";
    Sort.Direction direction = parts.length > 1 && parts[1].trim().equalsIgnoreCase("asc")
      ? Sort.Direction.ASC
      : Sort.Direction.DESC;

    return switch (property) {
      case "title", "severity", "status", "id", "reportedAt" -> Sort.by(direction, property);
      default -> Sort.by(Sort.Direction.DESC, "reportedAt");
    };
  }
}
