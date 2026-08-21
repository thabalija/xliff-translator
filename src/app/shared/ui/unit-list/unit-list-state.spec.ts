import { filterUnits } from './unit-list-state';
import { TranslationUnit } from '../../../xliff/types';

const units: TranslationUnit[] = [
  {
    id: '1',
    unitId: 'a',
    source: 'Hi',
    target: 'Hallo',
    targetState: 'translated',
    note: [],
  },
  {
    id: '2',
    unitId: 'b',
    source: 'Bye',
    target: null,
    targetState: 'initial',
    note: [],
  },
  {
    id: '3',
    unitId: 'c',
    source: 'Other',
    target: 'x',
    targetState: 'reviewed',
    note: [],
  },
];

describe('filterUnits', () => {
  it('returns all units', () => {
    expect(filterUnits(units, 'all')).toHaveLength(3);
  });

  it('filters translated units', () => {
    expect(filterUnits(units, 'translated').map((unit) => unit.id)).toEqual(['1']);
  });

  it('treats non-initial non-translated as other', () => {
    expect(filterUnits(units, 'other').map((unit) => unit.id)).toEqual(['3']);
  });
});
