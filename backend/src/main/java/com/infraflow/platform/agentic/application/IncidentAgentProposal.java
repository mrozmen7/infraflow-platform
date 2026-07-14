package com.infraflow.platform.agentic.application;

import java.util.List;

/** Provider-neutral result consumed by the AG-UI/A2UI adapter. */
public record IncidentAgentProposal(String sessionId, String provider, String mode, String incidentId,
  List<Recommendation> recommendations, List<RenderBlock> renderBlocks, List<ToolContract> tools, List<String> guardrails) {
  public record Recommendation(String id, String priority, String title, String summary, boolean requiresApproval) {}
  public record RenderBlock(String type, String title, String body) {}
  public record ToolContract(String name, String permission, String description) {}
}
