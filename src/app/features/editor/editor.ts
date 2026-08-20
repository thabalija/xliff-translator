import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectStore } from '../../core/project-store';
import { UnsavedComponent } from '../../core/project.guard';
import { downloadTextFile } from '../../core/download';
import { serializeTranslationFile } from '../../xliff/serialize';
import { LOCALE } from '../../locales/locales';
import { UnitList } from '../../shared/ui/unit-list/unit-list';
import { UnitFilter } from '../../shared/ui/unit-list/unit-list-state';
import { TranslationUnit } from '../../xliff/types';

@Component({
  selector: 'app-editor',
  imports: [DecimalPipe, MatButtonModule, MatFormFieldModule, MatSelectModule, UnitList],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
})
export class Editor implements UnsavedComponent {
  private readonly store = inject(ProjectStore);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  private readonly translationId = Number(this.route.snapshot.paramMap.get('id'));
  protected readonly languages = LOCALE;
  protected readonly filter = signal<UnitFilter>('all');
  protected readonly fileInfo = computed(() => this.store.translationInfo(this.translationId));
  protected readonly units = computed(() => this.store.unitsFor(this.translationId));
  protected readonly targetLang = linkedSignal(() => this.fileInfo()?.targetLang ?? '');

  hasUnsavedChanges(): boolean {
    return this.store.dirty();
  }

  protected onLanguageChange(locale: string): void {
    this.targetLang.set(locale);
    this.store.updateTranslationLanguage(this.translationId, locale);
  }

  protected onFilterChange(filter: UnitFilter): void {
    this.filter.set(filter);
  }

  protected onTargetChange(event: { unit: TranslationUnit; target: string }): void {
    const targetState =
      event.target.length && event.unit.targetState !== 'translated' ? 'translated' : event.unit.targetState;
    this.store.updateUnit(this.translationId, event.unit.id, {
      target: event.target,
      targetState,
    });
  }

  protected onStateChange(event: { unit: TranslationUnit; targetState: string }): void {
    this.store.updateUnit(this.translationId, event.unit.id, { targetState: event.targetState });
  }

  protected async copySource(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.snackBar.open('Source text copied', 'Close', { duration: 2000 });
    } catch {
      this.snackBar.open('Could not copy text', 'Close', { duration: 2000 });
    }
  }

  protected download(): void {
    const info = this.fileInfo();
    if (!info?.targetLang) {
      return;
    }
    const xml = serializeTranslationFile(this.store.originalXml(), this.units(), info.targetLang);
    downloadTextFile(xml, `${this.store.fileInfo()?.fileName ?? 'translation'}-${info.targetLang}`);
    this.store.markClean();
  }
}
