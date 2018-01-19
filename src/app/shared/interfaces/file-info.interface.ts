export interface FileInfo {
    id?: number;
    fileName: string;
    xliffVersion: string;
    sourceLang: string;
    targetLang?: string;
    totalUnits: number;
    datatype?: string;
    original?: string;
    translatedUnits?: number;
}
