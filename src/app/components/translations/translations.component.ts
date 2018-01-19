import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { FileUploadService } from './../../services/file-upload.service';
import { FileInfo } from './../../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../../shared/interfaces/translation-unit.interface';

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
  ) { }

  ngOnInit() {
    this.loadFile();
    this.translationsList = TRANSLATIONS;
    this.dataSource.data = this.translationsList;
  }

  // create file subscription
  loadFile() {
      this.fileInfo = this._fileUploadService.getFileInfo();
  }

  // open selected translation
  openTranslation(translation: FileInfo) {
    this._router.navigate([`/edit-translation/${translation.id}`]);
  }

}

export const TRANSLATIONS: FileInfo[] = [{
  id: 1,
  fileName: 'messages',
  xliffVersion: '1.2',
  sourceLang: 'en-US',
  targetLang: 'hr',
  totalUnits: 8,
  translatedUnits: 6
},
{
  id: 2,
  fileName: 'messages',
  xliffVersion: '1.2',
  sourceLang: 'en-US',
  targetLang: 'sp',
  totalUnits: 8,
  translatedUnits: 8
}];
