import { PageEvent } from '@angular/material/paginator';
import { TranslationUnit } from '../../../xliff/types';

export type UnitFilter = 'all' | 'initial' | 'translated' | 'other';

export function filterUnits(units: TranslationUnit[], filter: UnitFilter): TranslationUnit[] {
  if (filter === 'all') {
    return units;
  }
  if (filter === 'other') {
    return units.filter((unit) => {
      const state = unit.targetState.toLowerCase();
      return state !== 'initial' && state !== 'translated';
    });
  }
  return units.filter((unit) => unit.targetState === filter);
}

export function paginateUnits(
  units: TranslationUnit[],
  page: PageEvent,
): TranslationUnit[] {
  const start = page.pageIndex * page.pageSize;
  return units.slice(start, start + page.pageSize);
}
