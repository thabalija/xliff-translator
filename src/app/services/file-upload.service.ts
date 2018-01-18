import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { FileInfo } from './../shared/interfaces/file-info.interface';
import { TranslationUnit } from '../shared/interfaces/translation-unit.interface';

@Injectable()

export class FileUploadService {

  public uploadedFile = new Subject<HTMLDocument>();
  uploadedFile$ = this.uploadedFile.asObservable();

  public translationUnits = new Subject<TranslationUnit[]>();
  translationUnits$ = this.translationUnits.asObservable();

  public fileInfo = new Subject<FileInfo>();
  fileInfo$ = this.fileInfo.asObservable();

  public updateFile(data: HTMLDocument, fileName: string, sourceLang: string) {
    this.uploadedFile.next(data);
  }

  public updateTranslationUnits(htmlDoc: HTMLDocument) {
    const translationNodes: NodeList = htmlDoc.getElementsByTagName('trans-unit');
    const translationArray: HTMLElement[] = Array.from(translationNodes);
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

    this.translationUnits.next(translationUnits);
  }

  public updateFileInfo(htmlDoc: HTMLDocument, fileName: string, sourceLang: string) {

    const xliffElement = htmlDoc.getElementsByTagName('xliff')[0];
    const fileElement = htmlDoc.getElementsByTagName('file')[0];

    const fileInfo: FileInfo = {
      fileName: fileName,
      sourceLang: sourceLang,
      xliffVersion: xliffElement.getAttribute('version'),
      targetLang: fileElement.getAttribute('target-language'),
      totalUnits: htmlDoc.getElementsByTagName('trans-unit').length,
      datatype: fileElement.getAttribute('datatype'),
      original: fileElement.getAttribute('original')
    };

    this.fileInfo.next(fileInfo);
  }

}
