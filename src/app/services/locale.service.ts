import { Injectable } from '@angular/core';

import { Locale } from './../shared/interfaces/locale.interface';
import { LOCALE } from './../shared/data/locales';

@Injectable()

export class LocaleService {

  public getLocale(): Locale[] {
    return LOCALE;
  }

}