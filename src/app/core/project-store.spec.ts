import { TestBed } from '@angular/core/testing';
import { ProjectStore } from './project-store';
import { BrowserStorage } from './browser-storage';
import { ParsedXliff } from '../xliff/types';

class MemoryStorage {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
  readJson<T>(key: string, fallback: T): T {
    const raw = this.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  }
}

const parsed: ParsedXliff = {
  xml: '<xliff/>',
  units: [
    {
      id: 'u1',
      unitId: 'unit1',
      source: 'Hello',
      target: null,
      targetState: 'initial',
      note: [],
    },
  ],
  fileInfo: {
    fileName: 'app.xlf',
    sourceLang: 'en-US',
    totalUnits: 1,
    translatedUnits: 0,
  },
};

describe('ProjectStore', () => {
  let store: ProjectStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BrowserStorage, useClass: MemoryStorage }, ProjectStore],
    });
    store = TestBed.inject(ProjectStore);
  });

  it('creates a project and adds an independent translation copy', () => {
    store.createProject(parsed, 'app.xlf', 'en-US');
    const translation = store.addTranslation('de');
    store.updateUnit(translation.id!, 'u1', { target: 'Hallo', targetState: 'translated' });
    expect(store.sourceUnits()[0]?.target).toBeNull();
    expect(store.unitsFor(translation.id!)[0]?.target).toBe('Hallo');
    expect(store.translationInfo(translation.id!)?.translatedUnits).toBe(1);
  });

  it('does not keep a project after deleteProject', () => {
    store.createProject(parsed, 'app.xlf', 'en-US');
    store.deleteProject();
    expect(store.hasProject()).toBe(false);
  });
});
