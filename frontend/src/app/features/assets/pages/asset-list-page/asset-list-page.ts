import { DatePipe } from '@angular/common';
import { Component, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AssetRepositoryPort } from '../../application';

@Component({
  selector: 'app-asset-list-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './asset-list-page.html',
  styleUrl: './asset-list-page.scss',
})
export class AssetListPage {
  private readonly repository = inject(AssetRepositoryPort);
  protected readonly searchTerm = signal('');
  protected readonly assets = resource({
    params: () => this.searchTerm().trim(),
    loader: ({ params }) => this.repository.search(params),
  });

  protected updateSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
}
