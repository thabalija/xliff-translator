import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class FileUploadService {

  public uploadedFile = new Subject<any>();
  uploadedFile$ = this.uploadedFile.asObservable();

  public updateFile(data) {
   this.uploadedFile.next(data);
  }
}
