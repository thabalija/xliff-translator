import { Injectable } from '@angular/core';
import { FileInfo } from '../shared/interfaces/file-info.interface';
import { TranslationUnit } from '../shared/interfaces/translation-unit.interface';
import { FileUploadService } from './file-upload.service';
import { TranslationListService } from './translation-list.service';
import { TranslationUnitsService } from './translation-units.service';

@Injectable()
export class FileDownloadService {
  private originalFile: HTMLDocument;
  private translationUnits: TranslationUnit[];
  private fileInfo: FileInfo;

  constructor(
    private fileUploadService: FileUploadService,
    private translationListService: TranslationListService,
    private translationUnitsService: TranslationUnitsService
  ) {}

  public downloadFile(translationID: number): void {
    this.originalFile = this.fileUploadService.getFile();
    this.translationUnits = this.translationUnitsService.getTraslationUnits(translationID);
    this.fileInfo = this.translationListService.getTranslationInfo(translationID);

    this.translationUnits.forEach((transUnit: TranslationUnit) => {
      const targetElementList = this.originalFile.getElementById(transUnit.id).getElementsByTagName('target');
      let targetElement: Element;

      if (!targetElementList.length) {
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

    this.triggerBrowserFileDownload(finalFile, this.fileInfo.fileName);
  }

  private triggerBrowserFileDownload(file: string, fileName: string): void {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(file)
    );
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
