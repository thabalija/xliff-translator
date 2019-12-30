import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileUploadService } from '../../services/file-upload.service';
import { LocaleService } from '../../services/locale.service';
import { Locale } from '../../shared/interfaces/locale.interface';
import { ConfirmDialogComponent } from '../../shared/modules/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnInit {
  @HostBinding('class.flex-column-center') flexClass = true;

  public fileName = '';
  public fileSourceLang = '';
  public htmlDocument: HTMLDocument;
  public languages: Locale[];

  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    private localeService: LocaleService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
  ) {}

  ngOnInit(): void {
    this.loadLanguages();
  }

  private loadLanguages(): void {
    this.languages = this.localeService.getLocale();
  }

  public onFileChange(uploadedFile: File[]): void {
    if (!uploadedFile.length) {
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
        this.htmlDocument = parser.parseFromString(fileContent as string, 'application/xhtml+xml');
        const xliffElement = this.htmlDocument.getElementsByTagName('xliff')[0];
        this.fileSourceLang = xliffElement.getAttribute('srcLang');
        this.changeDetectorRef.markForCheck();
      };
      reader.readAsText(uploadedFile[0]);
    }
  }

  public openUploadFileDialog(): void {
    if (this.htmlDocument) {
      const hasUploadedFile: boolean = Boolean(localStorage.getItem('fileInfo'));

      if (hasUploadedFile) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Please confirm',
            content: `Are you sure you want to upload new file? All of your translations you haven't download will be lost!`,
            confirm: `Upload`
          }
        });
        dialogRef.afterClosed().subscribe((shouldUploadNewFile: boolean) => {
          if (shouldUploadNewFile) {
            this.uploadFile();
          }
        });
      } else {
        this.uploadFile();
      }
    } else {
      this.snackBar.open('Please choose a file', 'close', {
        duration: 2000
      });
    }
  }

  private uploadFile(): void {
    this.fileUploadService.uploadFile(this.htmlDocument, this.fileName, this.fileSourceLang);

    if (localStorage.getItem('fileInfo')) {
      this.router.navigate(['/translations']);
    } else {
      this.snackBar.open('Wild error occurred', 'close', { duration: 2000 });
    }
  }
}
