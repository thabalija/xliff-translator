import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, computed, input, output, signal } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TranslationUnit } from '../../../xliff/types';
import { notesToLabel } from '../../../core/download';
import { filterUnits, paginateUnits, UnitFilter } from './unit-list-state';

@Component({
  selector: 'app-unit-list',
  imports: [
    CdkTextareaAutosize,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
  templateUrl: './unit-list.html',
  styleUrl: './unit-list.scss',
})
export class UnitList {
  readonly units = input.required<TranslationUnit[]>();
  readonly mode = input<'translate' | 'source'>('translate');
  readonly filter = input<UnitFilter>('all');
  readonly copySource = output<string>();
  readonly targetChange = output<{ unit: TranslationUnit; target: string }>();
  readonly stateChange = output<{ unit: TranslationUnit; targetState: string }>();
  readonly sourceChange = output<{ unit: TranslationUnit; source: string }>();

  protected readonly page = signal<PageEvent>({ pageIndex: 0, pageSize: 5, length: 0 });
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  protected readonly filteredUnits = computed(() => filterUnits(this.units(), this.filter()));
  protected readonly pagedUnits = computed(() => paginateUnits(this.filteredUnits(), this.page()));

  protected onPage(event: PageEvent): void {
    this.page.set(event);
  }

  protected noteLabel(unit: TranslationUnit): string {
    return notesToLabel(unit.note);
  }

  protected onTargetInput(unit: TranslationUnit, event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.targetChange.emit({ unit, target: value });
  }

  protected onSourceInput(unit: TranslationUnit, event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.sourceChange.emit({ unit, source: value });
  }
}
