import { Injectable } from '@angular/core';

import { FileInfo } from '../shared/interfaces/file-info.interface';
import { TranslationUnit } from '../shared/interfaces/translation-unit.interface';

@Injectable()

export class TranslationUnitsService {

  constructor() { }

  public getTraslationUnits(translationID: number): TranslationUnit[] {
    return JSON.parse(localStorage.getItem(translationID.toString()));
  }

  public addTraslationUnits(translationID: number, translationUnits: TranslationUnit[]): void {
    localStorage.setItem(translationID.toString(), JSON.stringify(translationUnits));
  }

  public deleteTraslationUnits(translationID: number): void {
    localStorage.removeItem(translationID.toString());
  }

}
