import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocaleService } from '../../../../services/locale.service';
import { Locale } from '../../../interfaces/locale.interface';

@Component({
  templateUrl: './add-translation-dialog.component.html',
  styleUrls: ['./add-translation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTranslationDialogComponent {
  public languages: Locale[] = [];
  public localeObject: object;

  constructor(
    private localeService: LocaleService,
    public dialogRef: MatDialogRef<AddTranslationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.languages = this.localeService.getLocale();
    this.localeObject = this.localeService.getLocaleObject();
  }
}
