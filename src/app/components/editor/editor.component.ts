import { Component, OnInit } from '@angular/core';

import { FileDownloadService } from './../../services/file-download.service';
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
  translationUnits: TranslationUnit[] = [];
  show = 'all';

  constructor(
    private _fileUploadService: FileUploadService,
    private _fileDownloadService: FileDownloadService
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

  // save changes to localstorage
  saveChanges() {
    localStorage.setItem('translationUnits', JSON.stringify(this.translationUnits));
    localStorage.setItem('fileInfo', JSON.stringify(this.fileInfo));
  }

  // download file
  downloadFile(fileID: number): void {
    this.saveChanges();
    this._fileDownloadService.downloadFile(fileID);
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
