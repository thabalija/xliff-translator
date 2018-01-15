import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileUploadService } from './../../services/file-upload.service';
import { TranslationStatusService } from '../../services/translation-status.service';

@Component({
  selector: 'app-file-info',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.scss']
})
export class FileInfoComponent implements OnInit, OnDestroy {

  uploadedFile$;
  translationStatus$;
  file;
  uploadedFileInfo = {
    'targetLang': '',
    'sourceLang': '',
    'totalUnits': 0,
    'xliffVersion': '',
    'datatype': '',
    'original': '',
    'translatedUnits': 0
  };
  translationUnits = [];

  constructor(
    private _fileUploadService: FileUploadService,
    private _translationStatusService: TranslationStatusService,
  ) { }


  ngOnInit() {
    this.loadFiles();
    this.loadTranslationStatus();
  }

  // create file subscription
  loadFiles() {
    this.uploadedFile$ = this._fileUploadService.uploadedFile$.subscribe((res) => {
      this.file = res;
      this.processFile(this.file);
    });
  }

  // create translation status subscription
  loadTranslationStatus() {
    this.translationStatus$ = this._translationStatusService.translatedUnits$.subscribe((res) => {
      this.uploadedFileInfo.translatedUnits = res;
    });
  }

  processFile(htmlDoc: HTMLDocument) {
    console.log(htmlDoc);

    const elements = htmlDoc.getElementsByTagName('trans-unit');
    const arr = Array.from(elements);
    this.uploadedFileInfo.totalUnits = arr.length;
    const fileElement = htmlDoc.getElementsByTagName('file')[0];
    this.uploadedFileInfo.sourceLang = fileElement.getAttribute('source-language');
    this.uploadedFileInfo.targetLang = fileElement.getAttribute('target-language');
    this.uploadedFileInfo.datatype = fileElement.getAttribute('datatype');
    this.uploadedFileInfo.original = fileElement.getAttribute('original');
    const xliffElement = htmlDoc.getElementsByTagName('xliff')[0];
    this.uploadedFileInfo.xliffVersion = xliffElement.getAttribute('version');

    arr.forEach((el) => {
      const self = {
        id: el.getAttribute('id'),
        source: el.querySelector('source').innerHTML,
        target: el.querySelector('target').innerHTML,
        targetState: el.querySelector('target').getAttribute('state'),
        note: el.getElementsByTagName('note')
      };
      this.translationUnits.push(self);
    });
  }


  ngOnDestroy() {
    this.uploadedFile$.unsubscribe();
    this.translationStatus$.unsubscribe();
  }

}
