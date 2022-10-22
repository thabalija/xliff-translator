import { Injectable } from '@angular/core';
import { FileInfo } from '../shared/interfaces/file-info.interface';
import { TranslationUnit } from '../shared/interfaces/translation-unit.interface';

@Injectable({
  providedIn: 'root'
})
export class TranslationListService {
  private fileInfo: FileInfo;

  public getTranslationList(): FileInfo[] {
    return JSON.parse(localStorage.getItem('translationList')) || [];
  }

  public getTranslationInfo(translationId: number): FileInfo {
    return this.getTranslationList().find((fileInfo: FileInfo) => fileInfo.id === translationId);
  }

  public updateTranslationInfo(translationInfo: FileInfo): void {
    const translationList: Array<FileInfo> = this.getTranslationList();
    const savedTranslationIndex: number = translationList.findIndex((fileInfo: FileInfo) => {
      return fileInfo.id === translationInfo.id;
    });

    translationList[savedTranslationIndex] = translationInfo;
    localStorage.setItem('translationList', JSON.stringify(translationList));
  }

  public addTranslation(targetLang: string, translationUnits: Array<TranslationUnit> = [], fileName?: string): void {
    this.fileInfo = JSON.parse(localStorage.getItem('fileInfo'));
    const translationID = +new Date();
    const newTranslation = this.createNewTranslationInfo(translationID, targetLang, fileName);

    if (!translationUnits.length) {
      this.resetTargetElement(translationUnits);
    }

    newTranslation.translatedUnits = this.countTranslatedUnits(translationUnits);

    this.saveCreatedTranslation(newTranslation);
    this.saveTraslationUnits(translationID, translationUnits);
  }

  public deleteTranslation(translationId: number): void {
    const translationList = this.getTranslationList();
    translationList.splice(translationList.findIndex((fileInfo: FileInfo) => fileInfo.id === translationId), 1);
    localStorage.setItem('translationList', JSON.stringify(translationList));
  }

  public countTranslatedUnits(translationUnits: Array<TranslationUnit>): number {
    return translationUnits.reduce((count: number, unit: TranslationUnit) => {
      return unit.targetState.toLowerCase() === 'translated' ? count + 1 : count;
    }, 0);
  }

  private createNewTranslationInfo(translationID: number, targetLang?: string, fileName?: string): FileInfo {
    return {
      fileName,
      targetLang,
      id: translationID,
      sourceLang: this.fileInfo.sourceLang,
      totalUnits: this.fileInfo.totalUnits
    };
  }

  public resetTargetElement(translationUnits: Array<TranslationUnit>): Array<TranslationUnit> {
    return translationUnits.map((unit: TranslationUnit) => {
      unit.target = null;
      unit.targetState = 'initial';
      return unit;
    });
  }

  private saveCreatedTranslation(translation: FileInfo): void {
    const translationList = this.getTranslationList();
    translationList.push(translation);
    localStorage.setItem('translationList', JSON.stringify(translationList));
  }

  private saveTraslationUnits(translationID: number, translationUnits: Array<TranslationUnit>): void {
    localStorage.setItem(translationID.toString(), JSON.stringify(translationUnits));
  }
}
