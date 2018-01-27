import { Injectable } from '@angular/core';

import { FileInfo } from './../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../shared/interfaces/translation-unit.interface';
import { TranslationListService } from './translation-list.service';

@Injectable()

export class FileUploadService {

  constructor(
    private _translationListService: TranslationListService
  ) {}

  public uploadFile(htmlDoc: HTMLDocument, fileName: string, sourceLang: string) {

    localStorage.clear();

    const originalFile = htmlDoc;
    const fileElement = htmlDoc.getElementsByTagName('file')[0];
    const xliffElement = htmlDoc.getElementsByTagName('xliff')[0];
    const translationNodes = htmlDoc.getElementsByTagName('trans-unit');
    const translationArray = Array.from(translationNodes);
    const translationUnits: TranslationUnit[] = [];
    let translatedUnits = 0;

    translationArray.forEach((unit) => {

      const targetElementList = unit.getElementsByTagName('target');
      let targetElement: Element;

      // if target element does not exist create one, if exist select it
      if (targetElementList.length ===  0) {
        targetElement = document.createElement('TARGET');
        targetElement.setAttribute('state', 'new');
        unit.appendChild(targetElement);
      } else {
        targetElement = unit.getElementsByTagName('target')[0];
      }

      const notesNodes = unit.getElementsByTagName('note');
      const notesArray = Array.from(notesNodes);
      const notes = [];

      notesArray.forEach(note => {
        const noteObject = {
          from: note.getAttribute('from'),
          note: note.innerHTML
        };
        notes.push(noteObject);
      });

      const translationUnit = {
        id: unit.getAttribute('id'),
        source: unit.querySelector('source').innerHTML,
        target: targetElement.innerHTML,
        targetState: targetElement.getAttribute('state'),
        note: notes,
        showNote: false
      };
      if (unit.querySelector('target').getAttribute('state') === 'translated') {
        translatedUnits++;
      }
      translationUnits.push(translationUnit);
    });

    const fileInfo: FileInfo = {
      fileName: fileName,
      sourceLang: sourceLang,
      xliffVersion: xliffElement.getAttribute('version'),
      targetLang: fileElement.getAttribute('target-language'),
      totalUnits: htmlDoc.getElementsByTagName('trans-unit').length,
      datatype: fileElement.getAttribute('datatype'),
      original: fileElement.getAttribute('original'),
      translatedUnits: translatedUnits
    };

    // save file info
    localStorage.setItem('fileInfo', JSON.stringify(fileInfo));

    // save translation units
    localStorage.setItem('translationUnits', JSON.stringify(translationUnits));

    // save original file
    localStorage.setItem('uploadedFile', this.xmlToString(htmlDoc));

    if (fileInfo.targetLang) {
      this._translationListService.addTranslation(fileInfo.fileName, fileInfo.targetLang, true);
    }
  }

  // converts xml to string
  public xmlToString(file: HTMLDocument): string {
    return (new XMLSerializer()).serializeToString(file);
  }

  // converts string to xml
  public stringToXml(file: string): HTMLDocument {
    return (new DOMParser()).parseFromString(file, 'text/xml');
  }

  // get file info from local storage
  public getFileInfo(): FileInfo {
    return JSON.parse(localStorage.getItem('fileInfo'));
  }

  // get original file from local storage
  public getFile(): HTMLDocument {
    return this.stringToXml(localStorage.getItem('uploadedFile'));
  }

  // get original file from local storage
  public getTranslationUnits(): TranslationUnit[] {
    return JSON.parse(localStorage.getItem('translationUnits'));
  }

}
