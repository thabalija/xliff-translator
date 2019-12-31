import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FileDownloadService } from '../../services/file-download.service';
import { FileUploadService } from '../../services/file-upload.service';
import { LocaleService } from '../../services/locale.service';
import { TranslationListService } from '../../services/translation-list.service';
import { TranslationUnitsService } from '../../services/translation-units.service';
import { FileInfo } from '../../shared/interfaces/file-info.interface';
import { AddTranslationDialogComponent } from '../../shared/modules/shared/add-translation-dialog/add-translation-dialog.component';
import { ConfirmDialogComponent } from '../../shared/modules/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent implements OnInit {
  public baseFileInfo: FileInfo;
  public translationsList: FileInfo[] = [];
  public displayedColumns = ['language', 'status', 'delete', 'translate', 'download'];
  public dataSource = new MatTableDataSource<FileInfo>();
  public localeObject: object;
  public translationStatus: number;

  constructor(
    private dialog: MatDialog,
    private fileDownloadService: FileDownloadService,
    private fileUploadService: FileUploadService,
    private localeService: LocaleService,
    private router: Router,
    private translationListService: TranslationListService,
    private translationUnitsService: TranslationUnitsService
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
    this.dataSource.data = this.translationsList;

    if (this.translationsList.length) {
      let translatedUnits = 0;
      this.translationsList.forEach(translation => {
        translatedUnits = translatedUnits + translation.translatedUnits;
      });
      this.translationStatus =
        (translatedUnits /
          (this.baseFileInfo.totalUnits * this.translationsList.length)) *
        100;
    } else {
      this.translationStatus = 0;
    }
  }

  private loadLocaleObject(): void {
    this.localeObject = this.localeService.getLocaleObject();
  }

  public openAddTranslationDialog(): void {
    const dialogRef = this.dialog.open(AddTranslationDialogComponent, {
      width: '400px',
      data: {
        targetLang: ``,
        useTranslationUnits: true
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createTranslation(
          result.targetLang,
          result.useTranslationUnits
        );
      }
    });
  }

  private createTranslation(targetLang: string, useTranslationUnits: boolean): void {
    this.translationListService.addTranslation(targetLang, useTranslationUnits);
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
}
