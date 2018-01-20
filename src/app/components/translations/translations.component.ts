import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { FileInfo } from './../../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../../shared/interfaces/translation-unit.interface';
import { FileUploadService } from './../../services/file-upload.service';
import { FileDownloadService } from './../../services/file-download.service';
import { AddTranslationService } from './../../services/add-translation.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddTranslationDialogComponent } from './../../shared/modules/shared/add-translation-dialog/add-translation-dialog.component';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent implements OnInit {

  baseFileInfo: FileInfo;
  translationsList: FileInfo[] = [];
  displayedColumns = ['language', 'fileName', 'status', 'translate', 'download'];
  dataSource = new MatTableDataSource<FileInfo>();

  constructor(
    public _router: Router,
    private _fileUploadService: FileUploadService,
    private _fileDownloadService: FileDownloadService,
    private _addTranslationService: AddTranslationService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadBaseFileInfo();
    this.loadTranslations();
  }

  // load file info
  loadBaseFileInfo() {
    this.baseFileInfo = this._fileUploadService.getFileInfo();
  }

  // create translations
  loadTranslations() {
    this.translationsList = this._addTranslationService.getTranslationList();
    this.dataSource.data = this.translationsList;
    console.log(this.translationsList);
  }

  // add new translation
  addTranslation() {
    this._router.navigate([`/add-translation`]);
  }

  // open add translation dialog
  openAddTranslationDialog() {
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
  createTranslation(fileName: string, targetLang: string) {
    this._addTranslationService.addTranslation(fileName, targetLang);
    this.loadTranslations();
  }

  // open selected translation
  openTranslation(translation: FileInfo) {
    this._router.navigate([`/edit-translation/${translation.id}`]);
  }

  // download file
  downloadFile(fileID: number): void {
    this._fileDownloadService.downloadFile(fileID);
  }

}
