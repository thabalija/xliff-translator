export function downloadTextFile(
  content: string,
  fileName: string,
  mimeType = 'application/xliff+xml',
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName.endsWith('.xlf') || fileName.endsWith('.xml') ? fileName : `${fileName}.xlf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function notesToLabel(notes: { note: string }[]): string {
  return notes.map((item) => item.note).join(', ');
}
