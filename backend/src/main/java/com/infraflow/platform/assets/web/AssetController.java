package com.infraflow.platform.assets.web;

import com.infraflow.platform.assets.application.AssetService;
import com.infraflow.platform.assets.domain.AssetId;
import com.infraflow.platform.shared.error.ApiError;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/assets")
@Tag(name = "Assets", description = "Read-only operational asset registry")
class AssetController {
  private final AssetService assetService;
  AssetController(AssetService assetService) {
    this.assetService = assetService;
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
  @Operation(summary = "Search registered infrastructure assets")
  List<AssetResponse> search(
    @Parameter(description = "Free text filter for id, name, type or location")
    @RequestParam(defaultValue = "") String searchTerm
  ) {
    return assetService.search(searchTerm).stream().map(AssetResponse::from).toList();
  }

  @GetMapping("/{assetId}")
  @PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
  @Operation(summary = "Get asset by id")
  @ApiResponses({
    @ApiResponse(
      responseCode = "404",
      description = "Asset not found",
      content = @Content(schema = @Schema(implementation = ApiError.class))
    )
  })
  AssetResponse get(
    @Parameter(example = "TRF-NT-003")
    @PathVariable @Pattern(regexp = "[A-Z]{2,5}-[A-Z]{2,5}-\\d{3}") String assetId
  ) {
    return AssetResponse.from(assetService.get(new AssetId(assetId)));
  }
}
