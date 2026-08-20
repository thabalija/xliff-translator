import { computed, inject, Injectable, signal } from '@angular/core';
import { STORAGE_KEYS } from './constants';
import { BrowserStorage } from './browser-storage';
import { FileInfo, ParsedXliff, TranslationUnit } from '../xliff/types';
import { applySourceUpdates } from '../xliff/serialize';

function cloneUnits(units: TranslationUnit[]): TranslationUnit[] {
  return units.map((unit) => ({ ...unit, note: unit.note.map((note) => ({ ...note })) }));
}

function resetTargets(units: TranslationUnit[]): TranslationUnit[] {
  return cloneUnits(units).map((unit) => ({
    ...unit,
    target: null,
    targetState: 'initial',
  }));
}

function countTranslated(units: TranslationUnit[]): number {
  return units.filter((unit) => unit.targetState.toLowerCase() === 'translated').length;
}

function translationStorageKey(id: number): string {
  return String(id);
}

@Injectable({ providedIn: 'root' })
export class ProjectStore {
  private readonly storage = inject(BrowserStorage);

  readonly fileInfo = signal<FileInfo | null>(null);
  readonly sourceUnits = signal<TranslationUnit[]>([]);
  readonly originalXml = signal('');
  readonly translations = signal<FileInfo[]>([]);
  readonly unitsById = signal<Record<number, TranslationUnit[]>>({});
  readonly dirty = signal(false);

  readonly hasProject = computed(() => this.fileInfo() !== null);

  constructor() {
    this.restore();
  }

  restore(): void {
    const fileInfo = this.storage.readJson<FileInfo | null>(STORAGE_KEYS.fileInfo, null);
    if (!fileInfo) {
      this.clearMemory();
      return;
    }

    this.fileInfo.set(fileInfo);
    this.sourceUnits.set(this.storage.readJson<TranslationUnit[]>(STORAGE_KEYS.translationUnits, []));
    this.originalXml.set(this.storage.getItem(STORAGE_KEYS.uploadedFile) ?? '');
    const translations = this.storage.readJson<FileInfo[]>(STORAGE_KEYS.translationList, []);
    this.translations.set(translations);

    const unitsById: Record<number, TranslationUnit[]> = {};
    translations.forEach((translation) => {
      if (translation.id !== undefined) {
        unitsById[translation.id] = this.storage.readJson<TranslationUnit[]>(
          translationStorageKey(translation.id),
          [],
        );
      }
    });
    this.unitsById.set(unitsById);
    this.dirty.set(false);
  }

  createProject(parsed: ParsedXliff, fileName: string, sourceLang: string): void {
    this.removeKnownKeys();

    const fileInfo: FileInfo = {
      ...parsed.fileInfo,
      fileName,
      sourceLang,
    };

    this.fileInfo.set(fileInfo);
    this.sourceUnits.set(cloneUnits(parsed.units));
    this.originalXml.set(parsed.xml);
    this.translations.set([]);
    this.unitsById.set({});
    this.persistFile();

    if (fileInfo.targetLang) {
      this.addTranslation(fileInfo.targetLang, parsed.units);
    }
    this.dirty.set(false);
  }

  deleteProject(): void {
    this.removeKnownKeys();
    this.clearMemory();
  }

  addTranslation(targetLang: string, unitsToCopy?: TranslationUnit[]): FileInfo {
    const fileInfo = this.fileInfo();
    if (!fileInfo) {
      throw new Error('Cannot add a translation before a file is uploaded.');
    }

    const translationId = Date.now();
    const units = unitsToCopy ? cloneUnits(unitsToCopy) : resetTargets(this.sourceUnits());
    const translation: FileInfo = {
      id: translationId,
      fileName: fileInfo.fileName,
      sourceLang: fileInfo.sourceLang,
      targetLang,
      totalUnits: fileInfo.totalUnits,
      translatedUnits: countTranslated(units),
    };

    this.translations.update((list) => [...list, translation]);
    this.unitsById.update((map) => ({ ...map, [translationId]: units }));
    this.persistTranslations();
    this.persistUnits(translationId, units);
    return translation;
  }

  deleteTranslation(translationId: number): void {
    this.translations.update((list) => list.filter((item) => item.id !== translationId));
    this.unitsById.update((map) => {
      const next = { ...map };
      delete next[translationId];
      return next;
    });
    this.storage.removeItem(translationStorageKey(translationId));
    this.persistTranslations();
  }

  unitsFor(translationId: number): TranslationUnit[] {
    return this.unitsById()[translationId] ?? [];
  }

  translationInfo(translationId: number): FileInfo | undefined {
    return this.translations().find((item) => item.id === translationId);
  }

  updateTranslationLanguage(translationId: number, targetLang: string): void {
    this.patchTranslation(translationId, { targetLang });
  }

  updateUnit(translationId: number, unitId: string, patch: Partial<TranslationUnit>): void {
    const units = this.unitsFor(translationId).map((unit) =>
      unit.id === unitId ? { ...unit, ...patch } : unit,
    );
    this.unitsById.update((map) => ({ ...map, [translationId]: units }));
    this.patchTranslation(translationId, { translatedUnits: countTranslated(units) });
    this.persistUnits(translationId, units);
    this.dirty.set(true);
  }

  updateSourceUnit(unitId: string, source: string): void {
    const units = this.sourceUnits().map((unit) => (unit.id === unitId ? { ...unit, source } : unit));
    this.sourceUnits.set(units);
    this.persistSource();
    this.dirty.set(true);
  }

  applySourceToTranslations(): void {
    const sourceUnits = this.sourceUnits();
    const xml = applySourceUpdates(this.originalXml(), sourceUnits);
    this.originalXml.set(xml);
    this.persistFile();
    this.persistSource();

    const nextMap: Record<number, TranslationUnit[]> = {};
    Object.entries(this.unitsById()).forEach(([id, units]) => {
      const updated = units.map((unit) => {
        const sourceUnit = sourceUnits.find((item) => item.unitId === unit.unitId);
        return sourceUnit ? { ...unit, source: sourceUnit.source } : unit;
      });
      nextMap[Number(id)] = updated;
      this.persistUnits(Number(id), updated);
    });
    this.unitsById.set(nextMap);
    this.dirty.set(false);
  }

  saveSourceFile(): void {
    const xml = applySourceUpdates(this.originalXml(), this.sourceUnits());
    this.originalXml.set(xml);
    this.persistFile();
    this.persistSource();
    this.dirty.set(false);
  }

  markClean(): void {
    this.dirty.set(false);
  }

  private patchTranslation(translationId: number, patch: Partial<FileInfo>): void {
    this.translations.update((list) =>
      list.map((item) => (item.id === translationId ? { ...item, ...patch } : item)),
    );
    this.persistTranslations();
  }

  private persistFile(): void {
    const fileInfo = this.fileInfo();
    if (!fileInfo) {
      return;
    }
    this.storage.setItem(STORAGE_KEYS.fileInfo, JSON.stringify(fileInfo));
    this.storage.setItem(STORAGE_KEYS.uploadedFile, this.originalXml());
  }

  private persistSource(): void {
    this.storage.setItem(STORAGE_KEYS.translationUnits, JSON.stringify(this.sourceUnits()));
  }

  private persistTranslations(): void {
    this.storage.setItem(STORAGE_KEYS.translationList, JSON.stringify(this.translations()));
  }

  private persistUnits(translationId: number, units: TranslationUnit[]): void {
    this.storage.setItem(translationStorageKey(translationId), JSON.stringify(units));
  }

  private removeKnownKeys(): void {
    this.translations().forEach((translation) => {
      if (translation.id !== undefined) {
        this.storage.removeItem(translationStorageKey(translation.id));
      }
    });
    this.storage.removeItem(STORAGE_KEYS.fileInfo);
    this.storage.removeItem(STORAGE_KEYS.uploadedFile);
    this.storage.removeItem(STORAGE_KEYS.translationUnits);
    this.storage.removeItem(STORAGE_KEYS.translationList);
  }

  private clearMemory(): void {
    this.fileInfo.set(null);
    this.sourceUnits.set([]);
    this.originalXml.set('');
    this.translations.set([]);
    this.unitsById.set({});
    this.dirty.set(false);
  }
}
