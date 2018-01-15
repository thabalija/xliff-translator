import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileUploadService } from './../../services/file-upload.service';
import { TranslationStatusService } from '../../services/translation-status.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  uploadedFile$;
  uploadedFile;
  translationUnits = [];

  constructor(
    private _fileUploadService: FileUploadService,
    private _translationStatusService: TranslationStatusService,
  ) { }

  ngOnInit() {
    this.loadFiles();
  }

  // create file subscription
  loadFiles() {
    this.uploadedFile$ = this._fileUploadService.uploadedFile$.subscribe( (res) => {
      this.uploadedFile = res;
      this.processFile(this.uploadedFile);
    });
  }

  processFile(htmlDoc: HTMLDocument) {
    const elements = htmlDoc.getElementsByTagName('trans-unit');
    const arr = Array.from(elements);

    arr.forEach( (el) => {
      const unit = {
        id: el.getAttribute('id'),
        source: el.querySelector('source').innerHTML,
        target: el.querySelector('target').innerHTML,
        targetState: el.querySelector('target').getAttribute('state'),
        note: el.getElementsByTagName('note')
      };
      this.translationUnits.push(unit);
    });

    this._translationStatusService.translationStatus(55);
    console.log(this.translationUnits);
  }


  downloadFileCall() {

    this.translationUnits.forEach( (transUnit) => {
      this.uploadedFile.getElementById(transUnit.id).getElementsByTagName('target')[0].innerHTML = transUnit.target;
      this.uploadedFile.getElementById(transUnit.id).getElementsByTagName('target')[0].setAttribute('state', transUnit.targetState);
    });

    const stringer = new XMLSerializer();

    const finalFile = stringer.serializeToString(this.uploadedFile);

    this.downloadFile(finalFile, `messages.hr.xlf`);
  }

  downloadFile(file, fileName) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  ngOnDestroy() {
    this.uploadedFile$.unsubscribe();
  }

}
