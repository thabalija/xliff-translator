import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  fileInput: FormGroup;
  uploadedFile;
  finalFile;
  uploadedFileInfo = {
    'targetLang': '',
    'sourceLang': '',
    'xliffVersion': '',
    'datatype': '',
    'original': ''
  };
  translationUnits = [];

  constructor(
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  // create file input form
  createForm() {
    this.fileInput = this.fb.group({
      file: []
    });
  }

  ngOnInit() { }

  openFile(event) {
    const input = event.target;
    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {

      // this 'text' is the content of the file
      const text = reader.result;

      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(text, 'application/xhtml+xml');
      
      this.uploadedFile = htmlDoc;

      console.log(htmlDoc);

      const elements = htmlDoc.getElementsByTagName('trans-unit');
      const arr = Array.from(elements);

      const fileElement = htmlDoc.getElementsByTagName('file')[0];
      this.uploadedFileInfo.sourceLang = fileElement.getAttribute('source-language');
      this.uploadedFileInfo.targetLang = fileElement.getAttribute('target-language');
      this.uploadedFileInfo.datatype = fileElement.getAttribute('datatype');
      this.uploadedFileInfo.original = fileElement.getAttribute('original');
      const xliffElement = htmlDoc.getElementsByTagName('xliff')[0];
      this.uploadedFileInfo.xliffVersion = xliffElement.getAttribute('version');

      arr.forEach( (el) => {
        const self = {
          id: el.getAttribute('id'),
          source: el.querySelector('source').innerHTML,
          target: el.querySelector('target').innerHTML,
          targetState: el.querySelector('target').getAttribute('state'),
          note: el.getElementsByTagName('note')
        };
        this.translationUnits.push(self);
      });

      htmlDoc
        .getElementById('9a91783e9c0f790ed49edae730f9156070ed9dd5')
        .getElementsByTagName('target')[0] .innerHTML = 'dickbutt';


      const stringer = new XMLSerializer();

      this.finalFile = stringer.serializeToString(htmlDoc);

    };

    reader.readAsText(file);

  }

  downloadFileCall() {

    this.translationUnits.forEach( (transUnit) => {
      this.uploadedFile.getElementById(transUnit.id).getElementsByTagName('target')[0] .innerHTML = transUnit.target;
    });

    const stringer = new XMLSerializer();

    this.finalFile = stringer.serializeToString(this.uploadedFile);

    this.downloadFile(this.finalFile, `myName.${this.uploadedFileInfo.targetLang}.xlf`);
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

}

export interface TransUnit {
  id: string;
  source: string;
  target?: string;
  targetState?: string;
  note?: any;
}
