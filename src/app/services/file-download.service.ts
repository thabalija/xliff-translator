import { Injectable } from '@angular/core';

import { FileInfo } from '../shared/interfaces/file-info.interface';
import { TranslationUnit } from '../shared/interfaces/translation-unit.interface';
import { FileUploadService } from './file-upload.service';
import { TranslationUnitsService } from './translation-units.service';
import { TranslationListService } from './translation-list.service';

@Injectable()

export class FileDownloadService {

  private originalFile: HTMLDocument;
  private translationUnits: TranslationUnit[];
  private fileInfo: FileInfo;

  constructor(
    private _fileUploadService: FileUploadService,
    private _translationListService: TranslationListService,
    private _translationUnitsService: TranslationUnitsService
  ) { }

  // prepare translations for download
  public downloadFile(translationID: number): void {

    this.originalFile = this._fileUploadService.getFile();
    this.translationUnits = this._translationUnitsService.getTraslationUnits(translationID);
    this.fileInfo = this._translationListService.getTranslationInfo(translationID);

    this.translationUnits.forEach((transUnit) => {
      const targetElementList = this.originalFile.getElementById(transUnit.id).getElementsByTagName('target');
      let targetElement: Element;

      // if target element does not exist create one, if exist select it
      if (targetElementList.length ===  0) {
        targetElement = document.createElement('TARGET');
        this.originalFile.getElementById(transUnit.id).appendChild(targetElement);
      } else {
        targetElement = this.originalFile.getElementById(transUnit.id).getElementsByTagName('target')[0];
      }
      targetElement.innerHTML = transUnit.target;
      targetElement.setAttribute('state', transUnit.targetState);
    });

    const stringer = new XMLSerializer();
    const finalFile = stringer.serializeToString(this.originalFile);

    this.fileDownloader(finalFile, this.fileInfo.fileName);
  }

  // start file download in browser
  private fileDownloader(file: string, fileName: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}
