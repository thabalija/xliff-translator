import { Injectable } from '@angular/core';

import { FileInfo } from './../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../shared/interfaces/translation-unit.interface';
import { FileUploadService } from './file-upload.service';

@Injectable()

export class FileDownloadService {

  private originalFile: HTMLDocument;
  private translationUnits: TranslationUnit[];
  private fileInfo: FileInfo;

  constructor(
    private _fileUploadService: FileUploadService,
  ) { }

  public downloadFile(fileID: number): void {

    // TODO - detect file of multiple files via fileID

    this.originalFile = this._fileUploadService.getFile();
    this.translationUnits = this._fileUploadService.getTranslationUnits();
    this.fileInfo = this._fileUploadService.getFileInfo();

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

    console.log(this.originalFile, this.translationUnits, this.fileInfo);

    const stringer = new XMLSerializer();
    const finalFile = stringer.serializeToString(this.originalFile);

    this.fileDownloader(finalFile, this.fileInfo.fileName);

  }

  private fileDownloader(file: string, fileName: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}
