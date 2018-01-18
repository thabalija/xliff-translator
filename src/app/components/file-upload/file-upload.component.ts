import { Component, OnInit } from '@angular/core';

import { FileUploadService } from './../../services/file-upload.service';
import { Locale } from './../../shared/interfaces/locale.interface';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  fileName: string;
  fileSourceLang: string;
  htmlDocument: HTMLDocument;
  languages: Locale[];
  showComponent: boolean;

  constructor(
    private _fileUploadService: FileUploadService
  ) { }

  ngOnInit() {
    this.getLanguages();
  }

  getLanguages(): void {
    this.languages = [
      {language: 'Croatian', locale: 'hr'},
      {language: 'English - US', locale: 'en-US'}
    ];
  }

  onFileChange(uploadedFile: File[]): void {
    const file = uploadedFile[0];
    this.fileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      const parser = new DOMParser();
      this.htmlDocument = parser.parseFromString(fileContent, 'application/xhtml+xml');
      const fileElement = this.htmlDocument.getElementsByTagName('file')[0];
      this.fileSourceLang = fileElement.getAttribute('source-language');
    };
    reader.readAsText(uploadedFile[0]);
  }

  uploadFile(): void {
    if (this.htmlDocument) {
      this._fileUploadService.updateFile(this.htmlDocument, this.fileName, this.fileSourceLang);
      this._fileUploadService.updateTranslationUnits(this.htmlDocument);
      this._fileUploadService.updateFileInfo(this.htmlDocument, this.fileName, this.fileSourceLang);
    } else {
      // TODO mat snackbar
      console.log('please upload file');
    }
  }

}
