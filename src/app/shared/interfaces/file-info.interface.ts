export interface FileInfo {
    fileName: string;
    xliffVersion: string;
    sourceLang: string;
    targetLang?: string;
    totalUnits: number;
    datatype?: string;
    original?: string;
}
