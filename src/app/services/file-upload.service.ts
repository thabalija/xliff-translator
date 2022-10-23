import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SEGMENT_ATTRIBUTE_NAME } from '../constants/segment-attribute-name.const';
import { FileInfo } from './../shared/interfaces/file-info.interface';
import { Note, TranslationUnit } from './../shared/interfaces/translation-unit.interface';
import { TranslationListService } from './translation-list.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadedFile: Subject<boolean> = new Subject<boolean>();

  constructor(
    private translationListService: TranslationListService,
  ) {}

  public uploadFile(htmlDoc: HTMLDocument, fileName: string, sourceLang: string) {
    localStorage.clear();
    const unitNodes: Array<Element> = Array.from(htmlDoc.getElementsByTagName('unit'));
    const translationUnits: Array<TranslationUnit> = [];
    let translatedUnits = 0;

    unitNodes.forEach((unit: Element) => {
      const segmentElementList: HTMLCollectionOf<Element> = unit.getElementsByTagName('segment');

      Array.from(segmentElementList).forEach((segment: Element) => {
        const translationUnit: TranslationUnit = this.createTranslationUnit(unit, segment);
        const segmentState: string = segment.getAttribute('state');

        if (segmentState && segmentState.toLowerCase() === 'translated') {
          translatedUnits++;
        }

        translationUnits.push(translationUnit);
      });
    });

    const fileInfo: FileInfo = this.createFileInfo(htmlDoc, fileName, sourceLang, translatedUnits);
    this.saveUploadedFile(fileInfo, translationUnits, htmlDoc);

    if (fileInfo.targetLang) {
      this.translationListService.addTranslation(fileInfo.targetLang, translationUnits, fileInfo.fileName);
    }

    this.uploadedFile.next(true);
  }

  public updateFile(translationUnits: Array<TranslationUnit>): void {
    const htmlDoc: HTMLDocument = this.getFile();

    translationUnits.forEach((transUnit: TranslationUnit) => {
      const segmentElement: Element = Array.from(
        htmlDoc.getElementById(transUnit.unitId).getElementsByTagName('segment')
      ).find((element: Element) => element.getAttribute('id') === transUnit.segmentId);

      const sourceElementList: Array<Element> = Array.from(segmentElement.getElementsByTagName('source'));
      const sourceElement = sourceElementList.length ? sourceElementList[0] : null;

      if (sourceElement) {
        sourceElement.innerHTML = transUnit.source;
      }
    });

    localStorage.setItem('translationUnits', JSON.stringify(translationUnits));
    localStorage.setItem('uploadedFile', this.xmlToString(htmlDoc));
  }

  public deleteFile(): void {
    localStorage.clear();
    this.uploadedFile.next(false);
  }

  public isUploadedFile(): Observable<boolean> {
    return this.uploadedFile.asObservable();
  }

  public xmlToString(file: HTMLDocument): string {
    return new XMLSerializer().serializeToString(file);
  }

  public stringToXml(file: string): HTMLDocument {
    return new DOMParser().parseFromString(file, 'text/xml');
  }

  public getFileInfo(): FileInfo {
    return JSON.parse(localStorage.getItem('fileInfo'));
  }

  public getFile(): HTMLDocument {
    return this.stringToXml(localStorage.getItem('uploadedFile'));
  }

  private getNotes(notesNodes: NodeListOf<Element>): Note[] {
    const notesArray = Array.from(notesNodes);
    const notes = [];
    notesArray.forEach(note => {
      const noteObject = {
        from: note.getAttribute('from'),
        note: note.innerHTML,
      };
      notes.push(noteObject);
    });
    return notes;
  }

  private createTranslationUnit(unit: Element, segment: Element): TranslationUnit {
    const targetElementList = segment.getElementsByTagName('target');
    const targetElement: Element = targetElementList.length ? segment.getElementsByTagName('target')[0] : null;
    segment.setAttribute(SEGMENT_ATTRIBUTE_NAME, crypto.randomUUID())

    return {
      note: this.getNotes(unit.getElementsByTagName('note') as any),
      id: segment.getAttribute(SEGMENT_ATTRIBUTE_NAME),
      segmentId: segment.getAttribute('id'),
      showNote: false,
      source: segment.querySelector('source').innerHTML,
      target: targetElement ? targetElement.innerHTML : null,
      targetState: segment.getAttribute('state') || 'initial',
      unitId: unit.getAttribute('id'),
    };
  }

  private createFileInfo(
    htmlDoc: HTMLDocument,
    fileName: string,
    sourceLang: string,
    translatedUnits: number,
  ): FileInfo {
    const fileElement = htmlDoc.getElementsByTagName('file')[0];
    const xliffElement = htmlDoc.getElementsByTagName('xliff')[0];

    return {
      fileName,
      sourceLang,
      translatedUnits,
      datatype: fileElement.getAttribute('datatype'),
      original: fileElement.getAttribute('original'),
      targetLang: xliffElement.getAttribute('trgLang'),
      totalUnits: htmlDoc.getElementsByTagName('segment').length,
    };
  }

  private saveUploadedFile(fileInfo: FileInfo, translationUnits: Array<TranslationUnit>, htmlDoc: HTMLDocument): void {
    localStorage.setItem('fileInfo', JSON.stringify(fileInfo));
    localStorage.setItem('translationUnits', JSON.stringify(translationUnits));
    localStorage.setItem('uploadedFile', this.xmlToString(htmlDoc));
  }
}
