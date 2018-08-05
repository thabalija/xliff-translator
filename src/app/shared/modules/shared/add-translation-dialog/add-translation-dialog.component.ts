import { Component, Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Locale } from '../../../interfaces/locale.interface';
import { LocaleService } from './../../../../services/locale.service';

@Component({
  templateUrl: './add-translation-dialog.component.html',
  styleUrls: ['./add-translation-dialog.component.scss']
})
export class AddTranslationDialogComponent {

  languages: Locale[] = [];

  constructor(
    private _localeService: LocaleService,
    public dialogRef: MatDialogRef<AddTranslationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.loadLanguages();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // loads locale in select
  loadLanguages(): void {
    this.languages = this._localeService.getLocale();
  }

}
