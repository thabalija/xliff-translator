import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { FileInfo } from './../../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../../shared/interfaces/translation-unit.interface';
import { FileUploadService } from './../../services/file-upload.service';
import { FileDownloadService } from './../../services/file-download.service';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent implements OnInit {

  fileInfo: FileInfo;
  translationsList: FileInfo[] = [];
  displayedColumns = ['language', 'fileName', 'status', 'translate', 'download'];
  dataSource = new MatTableDataSource<FileInfo>();

  constructor(
    public _router: Router,
    private _fileUploadService: FileUploadService,
    private _fileDownloadService: FileDownloadService
  ) { }

  ngOnInit() {
    this.loadFileInfo();
    this.loadTranslations();
    this.dataSource.data = this.translationsList;
  }

  // create translations
  loadTranslations() {
    console.log(this.fileInfo);
    this.translationsList = [this.fileInfo];
  }

  // load file info
  loadFileInfo() {
    this.fileInfo = this._fileUploadService.getFileInfo();
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
