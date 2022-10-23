import { Injectable } from '@angular/core';
import { SEGMENT_ATTRIBUTE_NAME } from '../constants/segment-attribute-name.const';
import { FileInfo } from '../shared/interfaces/file-info.interface';
import { TranslationUnit } from '../shared/interfaces/translation-unit.interface';
import { FileUploadService } from './file-upload.service';
import { TranslationListService } from './translation-list.service';
import { TranslationUnitsService } from './translation-units.service';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  constructor(
    private fileUploadService: FileUploadService,
    private translationListService: TranslationListService,
    private translationUnitsService: TranslationUnitsService
  ) {}

  public downloadFile(translationID: number): void {
    const originalFile: HTMLDocument = this.fileUploadService.getFile();

    this.translationUnitsService.getTraslationUnits(translationID).forEach((transUnit: TranslationUnit) => {
      const segmentElement: Element = Array.from(
        originalFile.getElementsByTagName('segment')
      ).find((element: Element) => element.getAttribute(SEGMENT_ATTRIBUTE_NAME) === transUnit.id);

      const targetElementList: Array<Element> = Array.from(segmentElement.getElementsByTagName('target'));
      let targetElement = targetElementList.length ? targetElementList[0] : null;

      if (transUnit.target && transUnit.target.length && !targetElement) {
        targetElement = document.createElementNS('urn:oasis:names:tc:xliff:document:2.0', 'target');
        segmentElement.appendChild(targetElement);
      }

      if (targetElement) {
        targetElement.innerHTML = transUnit.target;
        segmentElement.setAttribute('state', transUnit.targetState);
      }

      segmentElement.removeAttribute(SEGMENT_ATTRIBUTE_NAME);
    });

    const targetLanguage: string = this.translationListService.getTranslationInfo(translationID).targetLang;
    const fileName: string = `${this.fileUploadService.getFileInfo().fileName}-${targetLanguage}`;
    originalFile.getElementsByTagName('xliff')[0].setAttribute('trgLang', targetLanguage);
    const stringer: XMLSerializer = new XMLSerializer();
    const finalFile: string = stringer.serializeToString(originalFile);

    this.triggerBrowserFileDownload(finalFile, fileName);
  }

  public downloadNewSourceFile(translationUnits: Array<TranslationUnit>): void {
    const originalFile: HTMLDocument = this.fileUploadService.getFile();

    translationUnits.forEach((transUnit: TranslationUnit) => {
      const segmentElement: Element = Array.from(
        originalFile.getElementsByTagName('segment')
      ).find((element: Element) => element.getAttribute(SEGMENT_ATTRIBUTE_NAME) === transUnit.id);

      const sourceElementList: Array<Element> = Array.from(segmentElement.getElementsByTagName('source'));
      const sourceElement = sourceElementList.length ? sourceElementList[0] : null;

      if (sourceElement) {
        sourceElement.innerHTML = transUnit.source;
      }

      segmentElement.removeAttribute(SEGMENT_ATTRIBUTE_NAME);
    });

    const fileInfo: FileInfo = this.fileUploadService.getFileInfo();
    const fileName: string = fileInfo.fileName;
    const stringer: XMLSerializer = new XMLSerializer();
    const finalFile: string = stringer.serializeToString(originalFile);

    this.triggerBrowserFileDownload(finalFile, fileName);
  }

  private triggerBrowserFileDownload(file: string, fileName: string): void {
    const element = document.createElement('a');
    const blob = new Blob([file], { type: 'text/plain' });
    element.setAttribute('href', window.URL.createObjectURL(blob));
    element.setAttribute('download', `${fileName}.xml`);
    element.dataset.downloadurl = ['text/plain', element.download, element.href].join(':');
    element.click();
  }
}
