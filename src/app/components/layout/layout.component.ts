import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import packageJson from '../../../../package.json';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit, OnDestroy {
  public isUploadedFile: boolean;
  private isUploadedFileSubscription: Subscription;

  constructor(private fileUploadService: FileUploadService) {}

  ngOnInit(): void {
    this.isUploadedFile = Boolean(localStorage.getItem('fileInfo'));
    this.isUploadedFileSubscription = this.fileUploadService.isUploadedFile().subscribe((uploadedFile: boolean) => {
      this.isUploadedFile = uploadedFile;
    });
  }

  ngOnDestroy(): void {
    this.isUploadedFileSubscription.unsubscribe();
  }

  public get version(): string {
    return packageJson.version;
  }
}
