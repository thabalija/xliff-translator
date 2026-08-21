import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LOCALE } from '../../../locales/locales';
import { localeNameMap } from '../../../locales/locale-map';
import { FileInfo } from '../../../xliff/types';
import {
  AddTranslationDialogData,
  AddTranslationDialogResult,
} from './add-translation-dialog-data';

@Component({
  selector: 'app-add-translation-dialog',
  imports: [
    FormField,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './add-translation-dialog.html',
  styleUrl: './add-translation-dialog.scss',
})
export class AddTranslationDialog {
  private readonly dialogRef = inject(MatDialogRef<AddTranslationDialog, AddTranslationDialogResult | false>);
  protected readonly data = inject<AddTranslationDialogData>(MAT_DIALOG_DATA);
  protected readonly languages = LOCALE;
  protected readonly localeNames = localeNameMap();

  protected readonly copyFromExisting = signal(false);
  protected readonly model = signal({
    targetLang: '',
    copyFromId: 0,
  });
  protected readonly translationForm = form(this.model, (fields) => {
    required(fields.targetLang, { message: 'Choose a target language' });
  });

  protected create(): void {
    if (!this.translationForm().valid()) {
      return;
    }
    const value = this.model();
    const translationToCopy = this.copyFromExisting()
      ? this.data.translatedLanguages.find((item) => item.id === value.copyFromId)
      : undefined;
    this.dialogRef.close({
      targetLang: value.targetLang,
      translationToCopy,
    });
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }

  protected languageLabel(translation: FileInfo): string {
    return translation.targetLang ? this.localeNames[translation.targetLang] ?? translation.targetLang : '';
  }
}
