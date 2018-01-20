import { Injectable } from '@angular/core';

import { FileInfo } from './../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../shared/interfaces/translation-unit.interface';
import { FileUploadService } from './file-upload.service';

@Injectable()

export class AddTranslationService {

  private fileInfo: FileInfo;
  private translationList: FileInfo[];
  private translationUnits: TranslationUnit[];

  constructor(
    private _fileUploadService: FileUploadService,
  ) { }

  // create new translation
  public addTranslation(fileName: string, targetLang: string): void {
    this.fileInfo = this._fileUploadService.getFileInfo();
    this.translationList = this.getTranslationList();
    if (this.translationList === null) {
      this.translationList = [];
    }
    const translationID = this.translationList.length + 1;

    const newTranslation: FileInfo = {
      id: translationID,
      fileName: fileName,
      xliffVersion: this.fileInfo.xliffVersion,
      sourceLang: this.fileInfo.sourceLang,
      targetLang: targetLang,
      totalUnits: this.fileInfo.totalUnits,
      translatedUnits: 0
    };

    this.saveCreatedTranslation(newTranslation);
  }

  // get list of translations
  public getTranslationList(): FileInfo[] {
    let translationList = JSON.parse(localStorage.getItem('translationList'));
    if (translationList === null) {
      translationList = [];
    }
    return translationList;
  }

  // save translation to localstorage
  private saveCreatedTranslation(translation: FileInfo): void {
    const translationList = this.getTranslationList();
    translationList.push(translation);
    localStorage.setItem('translationList', JSON.stringify(translationList));
  }

}

