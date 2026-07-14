import type { AssetRepositoryPort } from '../../application';
import type { Asset } from '../../domain/asset';

const assets: readonly Asset[] = [
  { id: 'TRF-NT-003', name: 'North tunnel transformer 3', type: 'Transformer', location: 'North Tunnel · KM 3.0', criticality: 'Critical', status: 'Degraded', lastInspectedAt: '2026-06-29T06:30:00.000Z' },
  { id: 'SNS-WT-118', name: 'West tunnel ventilation sensor 118', type: 'Air-flow sensor', location: 'West Tunnel · Ventilation Zone B', criticality: 'High', status: 'Degraded', lastInspectedAt: '2026-06-30T12:00:00.000Z' },
  { id: 'TEL-ST-012', name: 'South tunnel emergency phone 12', type: 'Emergency phone', location: 'South Tunnel · Bay 12', criticality: 'Medium', status: 'Operational', lastInspectedAt: '2026-06-15T09:00:00.000Z' },
];

export class MockAssetRepository implements AssetRepositoryPort {
  async search(searchTerm: string): Promise<readonly Asset[]> {
    const normalized = searchTerm.trim().toLocaleLowerCase();
    return assets.filter((asset) => [asset.id, asset.name, asset.type, asset.location].join(' ').toLocaleLowerCase().includes(normalized));
  }

  async findById(assetId: string): Promise<Asset | undefined> {
    return assets.find((asset) => asset.id === assetId);
  }
}
