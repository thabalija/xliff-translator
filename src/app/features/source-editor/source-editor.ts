import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProjectStore } from '../../core/project-store';
import { UnsavedComponent } from '../../core/project.guard';
import { downloadTextFile } from '../../core/download';
import { serializeSourceFile } from '../../xliff/serialize';
import { localeNameMap } from '../../locales/locale-map';
import { UnitList } from '../../shared/ui/unit-list/unit-list';
import { TranslationUnit } from '../../xliff/types';

@Component({
  selector: 'app-source-editor',
  imports: [MatButtonModule, UnitList],
  templateUrl: './source-editor.html',
  styleUrl: './source-editor.scss',
})
export class SourceEditor implements UnsavedComponent {
  private readonly store = inject(ProjectStore);
  private readonly localeNames = localeNameMap();

  protected readonly fileInfo = this.store.fileInfo;
  protected readonly units = this.store.sourceUnits;
  protected readonly title = computed(() => {
    const lang = this.fileInfo()?.sourceLang ?? '';
    return this.localeNames[lang] ?? lang;
  });

  hasUnsavedChanges(): boolean {
    return this.store.dirty();
  }

  protected onSourceChange(event: { unit: TranslationUnit; source: string }): void {
    this.store.updateSourceUnit(event.unit.id, event.source);
  }

  protected save(): void {
    this.store.saveSourceFile();
  }

  protected applyToExisting(): void {
    this.store.applySourceToTranslations();
  }

  protected download(): void {
    const xml = serializeSourceFile(this.store.originalXml(), this.units());
    downloadTextFile(xml, this.fileInfo()?.fileName ?? 'source');
    this.store.markClean();
  }
}
