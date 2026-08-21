import { SEGMENT_ATTRIBUTE_NAME } from '../core/constants';
import { FileInfo, Note, ParsedXliff, TranslationUnit, XliffParseError } from './types';

const XLIFF_NS = 'urn:oasis:names:tc:xliff:document:2.0';

function requiredElement(parent: Document | Element, tagName: string, label: string): Element {
  const element = parent.getElementsByTagName(tagName)[0];
  if (!element) {
    throw new XliffParseError(`Invalid XLIFF file: missing <${label}> element.`);
  }
  return element;
}

function notesFromUnit(unit: Element): Note[] {
  return Array.from(unit.getElementsByTagName('note')).map((note) => ({
    from: note.getAttribute('from'),
    note: note.innerHTML,
  }));
}

function createTranslationUnit(unit: Element, segment: Element): TranslationUnit {
  const source = segment.querySelector('source');
  if (!source) {
    throw new XliffParseError('Invalid XLIFF file: a segment is missing a <source> element.');
  }

  const target = segment.getElementsByTagName('target')[0] ?? null;
  if (!segment.getAttribute(SEGMENT_ATTRIBUTE_NAME)) {
    segment.setAttribute(SEGMENT_ATTRIBUTE_NAME, crypto.randomUUID());
  }

  return {
    id: segment.getAttribute(SEGMENT_ATTRIBUTE_NAME) ?? crypto.randomUUID(),
    unitId: unit.getAttribute('id') ?? '',
    segmentId: segment.getAttribute('id') ?? undefined,
    source: source.innerHTML,
    target: target ? target.innerHTML : null,
    targetState: segment.getAttribute('state') || 'initial',
    note: notesFromUnit(unit),
  };
}

export function parseXliff(xml: string, fileName: string, sourceLangOverride?: string): ParsedXliff {
  const document = new DOMParser().parseFromString(xml, 'application/xhtml+xml');
  const parserError = document.querySelector('parsererror');
  if (parserError) {
    throw new XliffParseError('The file could not be parsed as XML.');
  }

  const xliff = requiredElement(document, 'xliff', 'xliff');
  const version = xliff.getAttribute('version') ?? '';
  if (version.startsWith('1.')) {
    throw new XliffParseError('XLIFF 1.2 is not supported. Please upload an XLIFF 2.0 file.');
  }

  const file = requiredElement(document, 'file', 'file');
  const units: TranslationUnit[] = [];
  let translatedUnits = 0;

  Array.from(document.getElementsByTagName('unit')).forEach((unit) => {
    Array.from(unit.getElementsByTagName('segment')).forEach((segment) => {
      const translationUnit = createTranslationUnit(unit, segment);
      if (translationUnit.targetState.toLowerCase() === 'translated') {
        translatedUnits += 1;
      }
      units.push(translationUnit);
    });
  });

  if (units.length === 0) {
    throw new XliffParseError('No translation units were found in this file.');
  }

  const sourceLang = sourceLangOverride || xliff.getAttribute('srcLang') || '';
  const fileInfo: FileInfo = {
    fileName,
    sourceLang,
    translatedUnits,
    datatype: file.getAttribute('datatype'),
    original: file.getAttribute('original'),
    targetLang: xliff.getAttribute('trgLang'),
    totalUnits: units.length,
  };

  return {
    fileInfo,
    units,
    xml: new XMLSerializer().serializeToString(document),
  };
}

export function xmlDocumentFromString(xml: string): Document {
  return new DOMParser().parseFromString(xml, 'text/xml');
}

export { XLIFF_NS };
