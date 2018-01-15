import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class TranslationStatusService {

  public translatedUnits = new Subject<any>();
  translatedUnits$ = this.translatedUnits.asObservable();

  public translationStatus(data) {
   this.translatedUnits.next(data);
  }
}
