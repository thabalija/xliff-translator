import { Component, computed, inject } from '@angular/core';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectStore } from '../../core/project-store';
import { downloadTextFile } from '../../core/download';
import { serializeTranslationFile } from '../../xliff/serialize';
import { localeNameMap } from '../../locales/locale-map';
import { ConfirmDialog } from '../../shared/ui/confirm-dialog/confirm-dialog';
import { ConfirmDialogData } from '../../shared/ui/confirm-dialog/confirm-dialog-data';
import { AddTranslationDialog } from '../../shared/ui/add-translation-dialog/add-translation-dialog';
import { FileInfo } from '../../xliff/types';

@Component({
  selector: 'app-translations',
  imports: [DecimalPipe, SlicePipe, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './translations.html',
  styleUrl: './translations.scss',
})
export class Translations {
  private readonly store = inject(ProjectStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly localeNames = localeNameMap();

  protected readonly fileInfo = this.store.fileInfo;
  protected readonly translations = this.store.translations;
  protected readonly translationStatus = computed(() => {
    const list = this.translations();
    const base = this.fileInfo();
    if (!list.length || !base) {
      return 0;
    }
    const translatedUnits = list.reduce((count, item) => count + (item.translatedUnits ?? 0), 0);
    return (translatedUnits / (base.totalUnits * list.length)) * 100;
  });

  protected titleFor(translation: FileInfo): string {
    if (translation.targetLang) {
      return this.localeNames[translation.targetLang] ?? translation.targetLang;
    }
    return `${this.localeNames[translation.sourceLang] ?? translation.sourceLang} (Source)`;
  }

  protected percent(translation: FileInfo): number {
    return translation.totalUnits ? ((translation.translatedUnits ?? 0) / translation.totalUnits) * 100 : 0;
  }

  protected addTranslation(): void {
    this.dialog
      .open(AddTranslationDialog, {
        width: '400px',
        data: { translatedLanguages: this.translations().filter((item) => item.targetLang) },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        const copyUnits = result.translationToCopy?.id
          ? this.store.unitsFor(result.translationToCopy.id)
          : undefined;
        this.store.addTranslation(result.targetLang, copyUnits);
      });
  }

  protected editSource(): void {
    void this.router.navigate(['/edit-source-translation']);
  }

  protected openTranslation(translation: FileInfo): void {
    if (translation.id === undefined) {
      return;
    }
    void this.router.navigate(['/edit-translation', translation.id]);
  }

  protected download(translation: FileInfo): void {
    if (translation.id === undefined || !translation.targetLang) {
      return;
    }
    const xml = serializeTranslationFile(
      this.store.originalXml(),
      this.store.unitsFor(translation.id),
      translation.targetLang,
    );
    const fileName = `${this.fileInfo()?.fileName ?? 'translation'}-${translation.targetLang}`;
    downloadTextFile(xml, fileName);
  }

  protected confirmDeleteTranslation(translation: FileInfo): void {
    if (translation.id === undefined) {
      return;
    }
    this.dialog
      .open(ConfirmDialog, {
        width: '290px',
        data: {
          title: 'Delete translation',
          content: 'Are you sure you want to delete this translation?',
          confirm: 'Delete',
        } satisfies ConfirmDialogData,
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed && translation.id !== undefined) {
          this.store.deleteTranslation(translation.id);
        }
      });
  }

  protected confirmDeleteFile(): void {
    this.dialog
      .open(ConfirmDialog, {
        width: '290px',
        data: {
          title: 'Delete file',
          content: 'Are you sure you want to delete the uploaded file and all translations?',
          confirm: 'Delete',
        } satisfies ConfirmDialogData,
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.store.deleteProject();
          void this.router.navigate(['/']);
        }
      });
  }
}
