import { Injectable } from '@angular/core';
import { FileInfo } from '../shared/interfaces/file-info.interface';
import { TranslationUnit } from '../shared/interfaces/translation-unit.interface';

@Injectable()
export class TranslationListService {
  private fileInfo: FileInfo;

  public getTranslationList(): FileInfo[] {
    let translationList = JSON.parse(localStorage.getItem('translationList'));
    if (translationList === null) {
      translationList = [];
    }
    return translationList;
  }

  public getTranslationInfo(translationID: number): FileInfo {
    const translationList = JSON.parse(localStorage.getItem('translationList')) || [];
    let translationFileInfo: FileInfo;

    for (let i = 0; i < translationList.length; i++) {
      if (translationList[i].id === translationID) {
        translationFileInfo = translationList[i];
        break;
      }
    }

    return translationFileInfo;
  }

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

  public addTranslation(fileName: string, targetLang: string, useTranslationUnits: boolean): void {
    this.fileInfo = JSON.parse(localStorage.getItem('fileInfo'));
    const translationUnits = JSON.parse(localStorage.getItem('translationUnits'));
    const translationID = +new Date();
    const newTranslation = this.createNewTranslationInfo(translationID, fileName, targetLang);

    if (!useTranslationUnits) {
      this.resetTargetElement(translationUnits);
      newTranslation.translatedUnits = 0;
    } else {
      newTranslation.translatedUnits = this.countTranslatedUnits(
        translationUnits
      );
    }

    this.saveCreatedTranslation(newTranslation);
    this.saveTraslationUnits(translationID, translationUnits);
  }

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

  public countTranslatedUnits(translationUnits: TranslationUnit[]): number {
    return translationUnits.reduce((count: number, unit: TranslationUnit) => {
      return unit.targetState.toLowerCase() === 'translated' ? count++ : count;
    }, 0);
  }

  private createNewTranslationInfo(translationID: number, fileName: string, targetLang: string): FileInfo {
    const newFile = {
      fileName,
      targetLang,
      id: translationID,
      xliffVersion: this.fileInfo.xliffVersion,
      sourceLang: this.fileInfo.sourceLang,
      totalUnits: this.fileInfo.totalUnits
    };
    return newFile;
  }

  private resetTargetElement(translationUnits: TranslationUnit[]): TranslationUnit[] {
    translationUnits.forEach(unit => {
      unit.target = '';
      unit.targetState = 'new';
      return unit;
    });
    return translationUnits;
  }

  private saveCreatedTranslation(translation: FileInfo): void {
    const translationList = this.getTranslationList();
    translationList.push(translation);
    localStorage.setItem('translationList', JSON.stringify(translationList));
  }

  private saveTraslationUnits(translationID: number, translationUnits: TranslationUnit[]): void {
    localStorage.setItem(translationID.toString(), JSON.stringify(translationUnits));
  }
}
