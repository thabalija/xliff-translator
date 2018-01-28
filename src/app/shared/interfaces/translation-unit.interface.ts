export interface TranslationUnit {
    id: string;
    source: string;
    target: string;
    targetState: string;
    note: Note[];
    showNote: boolean;
}

export interface Note {
    from: string;
    note: string;
}
