import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Locale } from './../../shared/interfaces/locale.interface';
import { FileInfo } from './../../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../../shared/interfaces/translation-unit.interface';
import { LocaleService } from './../../services/locale.service';
import { FileUploadService } from './../../services/file-upload.service';
import { FileDownloadService } from './../../services/file-download.service';
import { TranslationListService } from '../../services/translation-list.service';
import { ConfirmDialogComponent } from './../../shared/modules/shared/confirm-dialog/confirm-dialog.component';
import { AddTranslationDialogComponent } from './../../shared/modules/shared/add-translation-dialog/add-translation-dialog.component';
import { TranslationUnitsService } from './../../services/translation-units.service';


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
  languages: Locale[];
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
    this.loadLanguages();
  }

  // load file info
  loadBaseFileInfo(): void {
    this.baseFileInfo = this._fileUploadService.getFileInfo();
  }

  // create translations
  loadTranslations(): void {
    this.translationsList = this._translationListService.getTranslationList();
    this.dataSource.data = this.translationsList;

    if (this.translationsList.length > 0) {
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
  loadLanguages(): void {
    this.languages = this._localeService.getLocale();
  }

  // open add translation dialog
  openAddTranslationDialog(): void {
    const dialogRef = this._dialog.open(AddTranslationDialogComponent, {
      width: '500px',
      data: {
        name: '',
        targetLang: ``
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createTranslation(result.name, result.targetLang);
      }
    });
  }

  // create new translation
  createTranslation(fileName: string, targetLang: string): void {
    this._translationListService.addTranslation(fileName, targetLang);
    this.loadTranslations();
  }

  // open add translation dialog
  openDeleteTranslationDialog(translationID: number): void {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '290px',
      data: {
        title: 'Delete translation',
        content: 'Are you sure you want to delete translation?',
        buttonColor: 'warn',
        confirm: 'Delete'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTranslation(translationID);
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
