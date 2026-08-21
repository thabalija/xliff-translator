import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { APP_VERSION } from '../constants';
import { ProjectStore } from '../project-store';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  private readonly store = inject(ProjectStore);
  protected readonly version = APP_VERSION;
  protected readonly hasProject = computed(() => this.store.hasProject());
}
