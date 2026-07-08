package com.infraflow.platform.workorders.web;

import com.infraflow.platform.workorders.application.WorkOrderService;
import com.infraflow.platform.workorders.domain.WorkOrderId;
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
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/work-orders")
@Tag(name = "Work orders", description = "Controlled work order drafting and inspection workflows")
class WorkOrderController {

  private final WorkOrderService workOrderService;

  WorkOrderController(WorkOrderService workOrderService) {
    this.workOrderService = workOrderService;
  }

  @GetMapping
  @Operation(summary = "List work orders")
  List<WorkOrderResponse> findAll() {
    return workOrderService.findAll().stream()
      .map(WorkOrderResponse::from)
      .toList();
  }

  @GetMapping("/{workOrderId}")
  @Operation(summary = "Get work order by id")
  WorkOrderResponse get(
    @Parameter(example = "WO-2026-0001")
    @PathVariable @Pattern(regexp = "WO-\\d{4}-\\d{4}") String workOrderId
  ) {
    return WorkOrderResponse.from(workOrderService.get(new WorkOrderId(workOrderId)));
  }

  @PostMapping("/drafts")
  @Operation(
    summary = "Draft a work order from an incident",
    description = "Creates a controlled work order draft from an existing incident context."
  )
  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Work order draft created"),
    @ApiResponse(
      responseCode = "400",
      description = "Request validation failed",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    ),
    @ApiResponse(
      responseCode = "404",
      description = "Incident not found",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    )
  })
  ResponseEntity<WorkOrderResponse> draftFromIncident(
    @Valid @RequestBody DraftWorkOrderRequest request
  ) {
    WorkOrderResponse response = WorkOrderResponse.from(
      workOrderService.draftFromIncident(request.toCommand())
    );

    return ResponseEntity
      .created(URI.create("/api/v1/work-orders/" + response.id()))
      .body(response);
  }
}
