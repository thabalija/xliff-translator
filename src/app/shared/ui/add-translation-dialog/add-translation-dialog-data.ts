import { FileInfo } from '../../../xliff/types';

export interface AddTranslationDialogData {
  translatedLanguages: FileInfo[];
}

export interface AddTranslationDialogResult {
  targetLang: string;
  translationToCopy?: FileInfo;
}
