import { Injectable } from '@angular/core';

import { FileInfo } from '../shared/interfaces/file-info.interface';
import { TranslationUnit } from '../shared/interfaces/translation-unit.interface';
import { FileUploadService } from './file-upload.service';
import { TranslationUnitsService } from './translation-units.service';

@Injectable()

export class TranslationListService {

  private fileInfo: FileInfo;
  private translationUnits: TranslationUnit[];

  constructor(
    private _translationUnitsService: TranslationUnitsService
  ) { }

  // get list of translations
  public getTranslationList(): FileInfo[] {
    let translationList = JSON.parse(localStorage.getItem('translationList'));
    if (translationList === null) {
      translationList = [];
    }
    return translationList;
  }

  // get translation info
  public getTranslationInfo(translationID: number): FileInfo {
    const translationList = JSON.parse(localStorage.getItem('translationList'));
    let translationFileInfo: FileInfo;
    for (let i = 0; i < translationList.length; i++) {
      if (translationList[i].id === translationID) {
        translationFileInfo = translationList[i];
        break;
      }
    }
    return translationFileInfo;
  }

  // update translation info
  public updateTranslationInfo(translationInfo: FileInfo): void {
    const translationList = JSON.parse(localStorage.getItem('translationList'));

    for (let i = 0; i < translationList.length; i++) {
      if (translationList[i].id === translationInfo.id) {
        translationList[i] = translationInfo;
        break;
      }
    }
    localStorage.setItem('translationList', JSON.stringify(translationList));
  }

  // create new translation
  public addTranslation(fileName: string, targetLang: string, useTranslationUnits: boolean): void {
    this.fileInfo = JSON.parse(localStorage.getItem('fileInfo'));
    const translationList = this.getTranslationList();
    const translationUnits = JSON.parse(localStorage.getItem('translationUnits'));
    const translationID = + new Date;
    const newTranslation: FileInfo = {
      id: translationID,
      fileName: fileName,
      xliffVersion: this.fileInfo.xliffVersion,
      sourceLang: this.fileInfo.sourceLang,
      targetLang: targetLang,
      totalUnits: this.fileInfo.totalUnits
    };

    if (!useTranslationUnits) {
      console.log(translationUnits);
      translationUnits.forEach((unit) => {
        unit.target = '';
        unit.targetState = 'new';
        return unit;
      });
      newTranslation.translatedUnits = 0;
      this.saveCreatedTranslation(newTranslation);
      this._translationUnitsService.addTraslationUnits(translationID, translationUnits);
    } else {
      newTranslation.translatedUnits = this.countTranslatedUnits(translationUnits);
      this.saveCreatedTranslation(newTranslation);
      this._translationUnitsService.addTraslationUnits(translationID, translationUnits);
    }
  }

  // delete translation
  public deleteTranslation(translationID: number): void {
    const translationList = this.getTranslationList();
    for (let i = 0; i < translationList.length; i++) {
      if (translationList[i].id === translationID) {
        translationList.splice(i, 1);
        break;
      }
    }
    localStorage.setItem('translationList', JSON.stringify(translationList));
  }

  // count how many units are marked as 'translated'
  public countTranslatedUnits(translationUnits: TranslationUnit[]): number {
    let translatedUnitsCount = 0;
    translationUnits.forEach(unit => {
      if (unit.targetState.toLowerCase() === 'translated') {
        translatedUnitsCount++;
      }
    });
    return translatedUnitsCount;
  }

  // save translation to localstorage
  private saveCreatedTranslation(translation: FileInfo): void {
    const translationList = this.getTranslationList();
    translationList.push(translation);
    localStorage.setItem('translationList', JSON.stringify(translationList));
  }

}

