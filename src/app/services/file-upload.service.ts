import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { FileInfo } from './../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../shared/interfaces/translation-unit.interface';

@Injectable()

export class FileUploadService {

  public uploadFile(htmlDoc: HTMLDocument, fileName: string, sourceLang: string) {

    const originalFile = htmlDoc;
    const fileElement = htmlDoc.getElementsByTagName('file')[0];
    const xliffElement = htmlDoc.getElementsByTagName('xliff')[0];
    const translationNodes = htmlDoc.getElementsByTagName('trans-unit');
    const translationArray = Array.from(translationNodes);
    const translationUnits: TranslationUnit[] = [];

    translationArray.forEach((unit) => {
      const translationUnit = {
        id: unit.getAttribute('id'),
        source: unit.querySelector('source').innerHTML,
        target: unit.querySelector('target').innerHTML,
        targetState: unit.querySelector('target').getAttribute('state'),
        note: unit.getElementsByTagName('note')
      };
      translationUnits.push(translationUnit);
    });

    const fileInfo: FileInfo = {
      fileName: fileName,
      sourceLang: sourceLang,
      xliffVersion: xliffElement.getAttribute('version'),
      targetLang: fileElement.getAttribute('target-language'),
      totalUnits: htmlDoc.getElementsByTagName('trans-unit').length,
      datatype: fileElement.getAttribute('datatype'),
      original: fileElement.getAttribute('original')
    };

    // save file info
    localStorage.setItem('fileInfo', JSON.stringify(fileInfo));

    // save translation units
    localStorage.setItem('translationUnits', JSON.stringify(translationUnits));

    // save original file
    localStorage.setItem('uploadedFile', this.xmlToString(htmlDoc));

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
    return JSON.parse(localStorage.getItem('uploadedFile'));
  }

  // get original file from local storage
  public getTranslationUnits(): TranslationUnit[] {
    return JSON.parse(localStorage.getItem('translationUnits'));
  }
}
