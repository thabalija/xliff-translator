import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class FileDownloadService {

  public fileForDownload = new Subject<any>();
  fileForDownload$ = this.fileForDownload.asObservable();

  public updateFile(data) {
    this.fileForDownload.next(data);
  }

  public getFile() {
    return this.fileForDownload;
  }
}
