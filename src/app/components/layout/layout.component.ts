import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isUploadedFile: boolean;
  isUploadedFileSubscription: Subscription;

  constructor(private _fileUploadService: FileUploadService) {}

  ngOnInit() {
    this.checkIfFileExist();
    this.isUploadedFileSubscription = this._fileUploadService
      .isUploadedFile()
      .subscribe((uploadedFile: boolean) => {
        this.isUploadedFile = uploadedFile;
      });
  }

  // check if user has uploaded file or not
  checkIfFileExist(): void {
    this.isUploadedFile = localStorage.getItem('fileInfo') ? true : false;
  }

  ngOnDestroy() {
    this.isUploadedFileSubscription.unsubscribe();
  }
}
