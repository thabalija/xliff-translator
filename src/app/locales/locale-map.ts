import { LOCALE } from './locales';

export function localeNameMap(): Record<string, string> {
  return Object.fromEntries(LOCALE.map((item) => [item.locale, item.language]));
}
