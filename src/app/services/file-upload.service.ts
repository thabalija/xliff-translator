import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FileInfo } from './../shared/interfaces/file-info.interface';
import { Note, TranslationUnit } from './../shared/interfaces/translation-unit.interface';
import { TranslationListService } from './translation-list.service';

@Injectable()
export class FileUploadService {
  private uploadedFile: Subject<boolean> = new Subject<boolean>();

  constructor(private translationListService: TranslationListService) {}

  public uploadFile(htmlDoc: HTMLDocument, fileName: string, sourceLang: string) {
    localStorage.clear();
    const unitNodes = htmlDoc.getElementsByTagName('unit');
    const translationUnits: TranslationUnit[] = [];
    let translatedUnits = 0;

    Array.from(unitNodes).forEach((unit: Element) => {
      const segmentElementList: HTMLCollectionOf<Element> = unit.getElementsByTagName('segment');

      Array.from(segmentElementList).forEach((segment: Element) => {
        const targetElementList = segment.getElementsByTagName('target');
        let targetElement: Element;

        if (!targetElementList.length) {
          targetElement = document.createElement('TARGET');
          targetElement.setAttribute('state', 'initial');
          segment.appendChild(targetElement);
        } else {
          targetElement = segment.getElementsByTagName('target')[0];
        }

        const translationUnit: TranslationUnit = {
          unitId: unit.getAttribute('id'),
          segmentId: segment.getAttribute('id'),
          source: segment.querySelector('source').innerHTML,
          target: targetElement.innerHTML,
          targetState: targetElement.getAttribute('state') || 'initial',
          note: this.getNotes(unit.getElementsByTagName('note') as any),
          showNote: false
        };

        const segmentState: string = segment.getAttribute('state');

        if (segmentState && segmentState.toLowerCase() === 'translated') {
          translatedUnits++;
        }

        translationUnits.push(translationUnit);
      });
    });

    const fileElement = htmlDoc.getElementsByTagName('file')[0];
    const xliffElement = htmlDoc.getElementsByTagName('xliff')[0];

    const fileInfo: FileInfo = {
      fileName,
      sourceLang,
      translatedUnits,
      datatype: fileElement.getAttribute('datatype'),
      original: fileElement.getAttribute('original'),
      targetLang: fileElement.getAttribute('trgLang'),
      totalUnits: htmlDoc.getElementsByTagName('unit').length,
      xliffVersion: xliffElement.getAttribute('version'),
    };

    localStorage.setItem('fileInfo', JSON.stringify(fileInfo));
    localStorage.setItem('translationUnits', JSON.stringify(translationUnits));
    localStorage.setItem('uploadedFile', this.xmlToString(htmlDoc));

    if (fileInfo.targetLang) {
      this.translationListService.addTranslation(
        fileInfo.fileName,
        fileInfo.targetLang,
        true
      );
    }

    this.uploadedFile.next(true);
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

  public getTranslationUnits(): TranslationUnit[] {
    return JSON.parse(localStorage.getItem('translationUnits'));
  }

  private getNotes(notesNodes: NodeListOf<Element>): Note[] {
    const notesArray = Array.from(notesNodes);
    const notes = [];
    notesArray.forEach(note => {
      const noteObject = {
        from: note.getAttribute('from'),
        note: note.innerHTML
      };
      notes.push(noteObject);
    });
    return notes;
  }
}
