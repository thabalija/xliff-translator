import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  fileInput: FormGroup;

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
    for (let index = 0; index < input.files.length; index++) {
      const reader = new FileReader();
      reader.onload = () => {
        // this 'text' is the content of the file
        const text = reader.result;

        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');

        const elements = htmlDoc.getElementsByTagName('trans-unit');

        const arr = Array.from(elements);

        const myArray = []; // empty Array
        for ( let i = 0; i < elements.length; i++) {
            const self = {
              id: elements[i].getAttribute('id'),
              source: elements[i].querySelector('source').innerHTML,
              target: elements[i].querySelector('target').innerHTML,
              targetState: elements[i].querySelector('target').getAttribute('state'),
              note: elements[i].getElementsByTagName('note')
            };
            myArray.push(self);
        }

        console.log(myArray);
      };
      reader.readAsText(input.files[index]);
    }
  }


}

export interface TransUnit {
  id: string;
  source: string;
  target?: string;
  targetState?: string;
  note?: string;
}
