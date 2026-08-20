export interface Note {
  from: string | null;
  note: string;
}

export type TargetState = 'initial' | 'translated' | string;

export interface TranslationUnit {
  id: string;
  unitId: string;
  segmentId?: string;
  source: string;
  target: string | null;
  targetState: TargetState;
  note: Note[];
}

export interface FileInfo {
  datatype?: string | null;
  fileName?: string;
  id?: number;
  original?: string | null;
  sourceLang: string;
  targetLang?: string | null;
  totalUnits: number;
  translatedUnits?: number;
}

export interface ParsedXliff {
  fileInfo: FileInfo;
  units: TranslationUnit[];
  xml: string;
}

export class XliffParseError extends Error {
  override readonly name = 'XliffParseError';
}
