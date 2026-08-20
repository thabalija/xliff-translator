import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileDrop } from '../../shared/ui/file-drop/file-drop';
import { ConfirmDialog } from '../../shared/ui/confirm-dialog/confirm-dialog';
import { ConfirmDialogData } from '../../shared/ui/confirm-dialog/confirm-dialog-data';
import { LOCALE } from '../../locales/locales';
import { parseXliff } from '../../xliff/parse';
import { XliffParseError } from '../../xliff/types';
import { ProjectStore } from '../../core/project-store';

@Component({
  selector: 'app-upload',
  host: { class: 'flex-column-center' },
  imports: [FileDrop, FormField, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class Upload {
  private readonly store = inject(ProjectStore);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected readonly languages = LOCALE;
  protected readonly fileXml = signal<string | null>(null);
  protected readonly model = signal({
    fileName: '',
    sourceLang: '',
  });
  protected readonly uploadForm = form(this.model, (fields) => {
    required(fields.fileName, { message: 'File name is required' });
    required(fields.sourceLang, { message: 'Source language is required' });
  });

  protected async onFilesSelected(files: File[]): Promise<void> {
    const file = files[0];
    if (!file) {
      this.fileXml.set(null);
      this.model.update((current) => ({ ...current, fileName: '', sourceLang: '' }));
      return;
    }

    const xml = await file.text();
    try {
      const parsed = parseXliff(xml, file.name);
      this.fileXml.set(xml);
      this.model.set({
        fileName: file.name,
        sourceLang: parsed.fileInfo.sourceLang,
      });
    } catch (error) {
      this.fileXml.set(null);
      const message = error instanceof XliffParseError ? error.message : 'Could not read that file.';
      this.snackBar.open(message, 'Close', { duration: 4000 });
    }
  }

  protected createProject(): void {
    const xml = this.fileXml();
    if (!xml || !this.uploadForm().valid()) {
      this.snackBar.open('Please choose a valid XLIFF file', 'Close', { duration: 2000 });
      return;
    }

    if (this.store.hasProject()) {
      this.dialog
        .open(ConfirmDialog, {
          width: '350px',
          data: {
            title: 'Please confirm',
            content:
              'Are you sure you want to upload a new file? Translations you have not downloaded will be lost.',
            confirm: 'Upload',
          } satisfies ConfirmDialogData,
        })
        .afterClosed()
        .subscribe((confirmed) => {
          if (confirmed) {
            this.commitUpload(xml);
          }
        });
      return;
    }

    this.commitUpload(xml);
  }

  private commitUpload(xml: string): void {
    const { fileName, sourceLang } = this.model();
    try {
      const parsed = parseXliff(xml, fileName, sourceLang);
      this.store.createProject(parsed, fileName, sourceLang);
      void this.router.navigate(['/translations']);
    } catch (error) {
      const message = error instanceof XliffParseError ? error.message : 'Wild error occurred';
      this.snackBar.open(message, 'Close', { duration: 2000 });
    }
  }
}
