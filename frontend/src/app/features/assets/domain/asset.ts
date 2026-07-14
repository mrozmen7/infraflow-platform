export const assetCriticalities = ['Low', 'Medium', 'High', 'Critical'] as const;
export const assetStatuses = ['Operational', 'Degraded', 'Maintenance', 'Out of Service'] as const;

export type AssetCriticality = (typeof assetCriticalities)[number];
export type AssetStatus = (typeof assetStatuses)[number];

export interface Asset {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly location: string;
  readonly criticality: AssetCriticality;
  readonly status: AssetStatus;
  readonly lastInspectedAt: string;
}
