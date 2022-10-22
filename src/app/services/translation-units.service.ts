import { Injectable } from '@angular/core';
import { TranslationUnit } from '../shared/interfaces/translation-unit.interface';

@Injectable({
  providedIn: 'root'
})
export class TranslationUnitsService {
  public getTraslationUnits(translationId?: number): TranslationUnit[] {
    return translationId
      ? JSON.parse(localStorage.getItem(translationId.toString())) || []
      : JSON.parse(localStorage.getItem('translationUnits'));
  }

  public addTraslationUnits(translationId: number, translationUnits: TranslationUnit[]): void {
    localStorage.setItem(translationId.toString(), JSON.stringify(translationUnits));
  }

  public deleteTraslationUnits(translationId: number): void {
    localStorage.removeItem(translationId.toString());
  }
}
