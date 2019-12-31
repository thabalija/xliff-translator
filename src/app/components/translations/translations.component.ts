import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FileDownloadService } from '../../services/file-download.service';
import { FileUploadService } from '../../services/file-upload.service';
import { LocaleService } from '../../services/locale.service';
import { TranslationListService } from '../../services/translation-list.service';
import { TranslationUnitsService } from '../../services/translation-units.service';
import { FileInfo } from '../../shared/interfaces/file-info.interface';
import { TranslationUnit } from '../../shared/interfaces/translation-unit.interface';
import { AddTranslationDialogComponent } from '../../shared/modules/shared/add-translation-dialog/add-translation-dialog.component';
import { ConfirmDialogComponent } from '../../shared/modules/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationsComponent implements OnInit {
  public baseFileInfo: FileInfo;
  public localeObject: object;
  public translationsList: Array<FileInfo> = [];
  public translationStatus: number;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private fileDownloadService: FileDownloadService,
    private fileUploadService: FileUploadService,
    private localeService: LocaleService,
    private router: Router,
    private translationListService: TranslationListService,
    private translationUnitsService: TranslationUnitsService,
  ) {}

  ngOnInit() {
    this.loadBaseFileInfo();
    this.loadTranslations();
    this.loadLocaleObject();
  }

  private loadBaseFileInfo(): void {
    this.baseFileInfo = this.fileUploadService.getFileInfo();
  }

  private loadTranslations(): void {
    this.translationsList = this.translationListService.getTranslationList();

    if (this.translationsList.length) {
      const translatedUnits: number = this.translationsList.reduce((count: number, translation: FileInfo) => {
        return count + translation.translatedUnits;
      }, 0);
      this.translationStatus = (translatedUnits / (this.baseFileInfo.totalUnits * this.translationsList.length)) * 100;
    } else {
      this.translationStatus = 0;
    }

    this.changeDetectorRef.markForCheck();
  }

  private loadLocaleObject(): void {
    this.localeObject = this.localeService.getLocaleObject();
  }

  public openAddTranslationDialog(): void {
    const dialogRef = this.dialog.open(AddTranslationDialogComponent, {
      width: '400px',
      data: {
        targetLang: ``,
        useTranslationUnits: false,
        translatedLanguages: this.translationsList,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const translationUnits: Array<TranslationUnit> = result.translationToCopy
          ? this.translationUnitsService.getTraslationUnits(result.translationToCopy.id)
          : this.translationListService.resetTargetElement(this.getBaseTranslationUnits());

        this.createTranslation(result.targetLang, translationUnits);
      }
    });
  }

  private getBaseTranslationUnits(): Array<TranslationUnit> {
    return this.translationUnitsService.getTraslationUnits();
  }

  private createTranslation(targetLang: string, translationUnits: Array<TranslationUnit> = []): void {
    this.translationListService.addTranslation(targetLang, translationUnits);
    this.loadTranslations();
  }

  public openDeleteTranslationDialog(translationID: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '290px',
      data: {
        title: 'Delete translation',
        content: 'Are you sure you want to delete translation?',
        confirm: 'Delete'
      }
    });
    dialogRef.afterClosed().subscribe((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.deleteTranslation(translationID);
      }
    });
  }

  public openDeleteFileDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '290px',
      data: {
        title: 'Delete file',
        content:
          'Are you sure you want to delete uploaded file and all translations?',
        confirm: 'Delete'
      }
    });
    dialogRef.afterClosed().subscribe((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.fileUploadService.deleteFile();
        this.router.navigate(['']);
      }
    });
  }

  public deleteTranslation(translationID: number): void {
    this.translationListService.deleteTranslation(translationID);
    this.translationUnitsService.deleteTraslationUnits(translationID);
    this.loadTranslations();
  }

  public openTranslation(translation: FileInfo): void {
    this.router.navigate([`/edit-translation/${translation.id}`]);
  }

  public downloadFile(fileID: number): void {
    this.fileDownloadService.downloadFile(fileID);
  }

  public getTranslationTitle(translationInfo: FileInfo): string {
    return translationInfo.targetLang
      ? this.localeObject[translationInfo.targetLang]
      : `${this.localeObject[translationInfo.sourceLang]} (Source)`;
  }
}
