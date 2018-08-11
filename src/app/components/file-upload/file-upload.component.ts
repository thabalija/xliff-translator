import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { FileUploadService } from '../../services/file-upload.service';
import { LocaleService } from '../../services/locale.service';
import { Locale } from '../../shared/interfaces/locale.interface';
import { ConfirmDialogComponent } from '../../shared/modules/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @HostBinding('class.flex-column-center') flexClass = true;

  fileName = '';
  fileSourceLang = '';
  htmlDocument: HTMLDocument;
  languages: Locale[];
  showComponent: boolean;

  constructor(
    public _router: Router,
    private _fileUploadService: FileUploadService,
    private _localeService: LocaleService,
    public snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadLanguages();
  }

  // loads locale in select
  loadLanguages(): void {
    this.languages = this._localeService.getLocale();
  }

  // read file info, fill name, language input fields with values from file
  onFileChange(uploadedFile: File[]): void {
    if (uploadedFile.length === 0) {
      this.fileName = '';
      this.fileSourceLang = '';
      this.htmlDocument = undefined;
    } else {
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
  }

  // open upload file dialog
  openUploadFileDialog(): void {
    if (this.htmlDocument) {
      if (localStorage.getItem('fileInfo')) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Please confirm',
            content: `Are you sure you want to upload new file? All of your translations you haven't download will be lost!`,
            confirm: `Upload`
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.uploadFile();
          }
        });
      } else {
        this.uploadFile();
      }
    } else {
      this.snackBar.open('Please choose a file', 'close', {
        duration: 2000,
      });
    }
  }

  // send file to service for uploading to localstorage
  uploadFile(): void {
    this._fileUploadService.uploadFile(this.htmlDocument, this.fileName, this.fileSourceLang);
    if (localStorage.getItem('fileInfo')) {
      this._router.navigate(['/translations']);
    } else {
      this.snackBar.open('Wild error occurred', 'close', {
        duration: 2000,
      });
    }
  }

}
