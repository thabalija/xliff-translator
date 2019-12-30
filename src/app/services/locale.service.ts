import { Injectable } from '@angular/core';
import { LOCALE } from '../shared/data/locales';
import { Locale } from '../shared/interfaces/locale.interface';

@Injectable()
export class LocaleService {
  public getLocale(): Locale[] {
    return LOCALE;
  }

  public getLocaleObject(): object {
    const locale = {};
    LOCALE.forEach((loc) => {
      locale[loc.locale] = loc.language;
    });
    return locale;
  }
}
