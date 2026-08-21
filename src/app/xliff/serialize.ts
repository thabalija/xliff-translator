import { SEGMENT_ATTRIBUTE_NAME } from '../core/constants';
import { TranslationUnit } from './types';
import { XLIFF_NS, xmlDocumentFromString } from './parse';

function findSegment(document: Document, unit: TranslationUnit): Element | undefined {
  return Array.from(document.getElementsByTagName('segment')).find(
    (element) => element.getAttribute(SEGMENT_ATTRIBUTE_NAME) === unit.id,
  );
}

function stripRuntimeAttribute(segment: Element): void {
  segment.removeAttribute(SEGMENT_ATTRIBUTE_NAME);
}

export function serializeTranslationFile(
  originalXml: string,
  units: TranslationUnit[],
  targetLang: string,
): string {
  const document = xmlDocumentFromString(originalXml);

  units.forEach((unit) => {
    const segment = findSegment(document, unit);
    if (!segment) {
      return;
    }

    const existingTarget = segment.getElementsByTagName('target')[0] ?? null;
    let target = existingTarget;

    if (unit.target && unit.target.length > 0 && !target) {
      target = document.createElementNS(XLIFF_NS, 'target');
      segment.appendChild(target);
    }

    if (target) {
      target.innerHTML = unit.target ?? '';
      segment.setAttribute('state', unit.targetState);
    }

    stripRuntimeAttribute(segment);
  });

  document.getElementsByTagName('xliff')[0]?.setAttribute('trgLang', targetLang);
  return new XMLSerializer().serializeToString(document);
}

export function serializeSourceFile(originalXml: string, units: TranslationUnit[]): string {
  const document = xmlDocumentFromString(originalXml);

  units.forEach((unit) => {
    const segment = findSegment(document, unit);
    if (!segment) {
      return;
    }

    const source = segment.getElementsByTagName('source')[0];
    if (source) {
      source.innerHTML = unit.source;
    }
    stripRuntimeAttribute(segment);
  });

  return new XMLSerializer().serializeToString(document);
}

export function applySourceUpdates(originalXml: string, units: TranslationUnit[]): string {
  return serializeSourceFile(originalXml, units);
}
