import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Asset } from '../../domain/asset';

@Component({
  selector: 'app-asset-detail-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './asset-detail-page.html',
  styleUrl: './asset-detail-page.scss',
})
export class AssetDetailPage {
  readonly asset = input.required<Asset>();
}
