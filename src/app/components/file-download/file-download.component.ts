import { Component, OnInit } from '@angular/core';
import { FileDownloadService } from './../../services/file-download.service';

@Component({
  selector: 'app-file-download',
  templateUrl: './file-download.component.html',
  styleUrls: ['./file-download.component.scss']
})
export class FileDownloadComponent implements OnInit {

  file;

  constructor(
    private _fileDownloadService: FileDownloadService
  ) { }

  ngOnInit() {}

  // get latest file from server
  downloadFile() {
    this.file = this._fileDownloadService.getFile();
  }

}
