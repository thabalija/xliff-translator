import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FileUploadService } from './../../services/file-upload.service';

import { FileInfo } from './../../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../../shared/interfaces/translation-unit.interface';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  fileInfo: FileInfo;
  uploadedFile: HTMLDocument;
  translationUnits: TranslationUnit[] = [];
  show = 'all';

  constructor(
    private _fileUploadService: FileUploadService,
  ) { }

  ngOnInit() {
    this.loadFileInfo();
    this.loadTranslationUnits();
  }

  // get file info from localstorage
  loadFileInfo() {
    this.fileInfo = this._fileUploadService.getFileInfo();
  }

  // get translation units from localstorage
  loadTranslationUnits() {
    this.translationUnits = this._fileUploadService.getTranslationUnits();
  }
  // get original file from localstorage
  loadOriginalFile() {
    this.uploadedFile = this._fileUploadService.getFile();
  }

  // save changes to localstorage
  saveChanges(translationUnits: TranslationUnit[]) {
    localStorage.removeItem('translationUnits');
    localStorage.setItem('translationUnits', JSON.stringify(translationUnits));
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

  // copies input text to clipboard
  copy(text) {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            return true;
        }
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
    return false;
  }

}
