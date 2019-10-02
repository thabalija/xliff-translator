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

  baseFileInfo: FileInfo;
  translationsList: FileInfo[] = [];
  displayedColumns = ['language', 'status', 'delete', 'translate', 'download'];
  dataSource = new MatTableDataSource<FileInfo>();
  localeObject: Object;
  translationStatus: number;

  constructor(
    public _router: Router,
    private _fileUploadService: FileUploadService,
    private _fileDownloadService: FileDownloadService,
    private _translationListService: TranslationListService,
    private _translationUnitsService: TranslationUnitsService,
    private _localeService: LocaleService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadBaseFileInfo();
    this.loadTranslations();
    this.loadLocaleObject();
  }

  // load file info
  loadBaseFileInfo(): void {
    this.baseFileInfo = this._fileUploadService.getFileInfo();
  }

  // create translations from translation units
  loadTranslations(): void {
    this.translationsList = this._translationListService.getTranslationList();
    this.dataSource.data = this.translationsList;

    if (this.translationsList.length) {
      let translatedUnits = 0;
      this.translationsList.forEach(translation => {
        translatedUnits = translatedUnits + translation.translatedUnits;
      });
      this.translationStatus = (translatedUnits / (this.baseFileInfo.totalUnits * this.translationsList.length)) * 100;
    } else {
      this.translationStatus = 0;
    }
  }

  // load locale in table
  loadLocaleObject(): void {
    this.localeObject = this._localeService.getLocaleObject();
  }

  // open add translation dialog
  openAddTranslationDialog(): void {
    const dialogRef = this._dialog.open(AddTranslationDialogComponent, {
      width: '500px',
      data: {
        fileName: '',
        targetLang: ``,
        useTranslationUnits: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createTranslation(result.fileName, result.targetLang, result.useTranslationUnits);
      }
    });
  }

  // create new translation
  createTranslation(fileName: string, targetLang: string, useTranslationUnits: boolean): void {
    this._translationListService.addTranslation(fileName, targetLang, useTranslationUnits);
    this.loadTranslations();
  }

  // open add translation dialog
  openDeleteTranslationDialog(translationID: number): void {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '290px',
      data: {
        title: 'Delete translation',
        content: 'Are you sure you want to delete translation?',
        confirm: 'Delete'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTranslation(translationID);
      }
    });
  }

  // open delete file dialog
  openDeleteFileDialog(): void {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '290px',
      data: {
        title: 'Delete file',
        content: 'Are you sure you want to delete uploaded file and all translations?',
        confirm: 'Delete'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._fileUploadService.deleteFile();
        this._router.navigate(['']);
      }
    });
  }

  // delete translation
  deleteTranslation(translationID: number): void {
    this._translationListService.deleteTranslation(translationID);
    this._translationUnitsService.deleteTraslationUnits(translationID);
    this.loadTranslations();
  }

  // open selected translation
  openTranslation(translation: FileInfo): void {
    this._router.navigate([`/edit-translation/${translation.id}`]);
  }

  // download file
  downloadFile(fileID: number): void {
    this._fileDownloadService.downloadFile(fileID);
  }

}
