import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FileUploadService } from './../../services/file-upload.service';
import { FileInfo } from './../../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../../shared/interfaces/translation-unit.interface';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent implements OnInit, OnDestroy {

  translationUnits: TranslationUnit[];
  translationUnits$: Subscription;
  fileInfo: FileInfo;
  fileInfo$: Subscription;

  constructor(
    public router: Router,
    private _fileUploadService: FileUploadService,
  ) { }

  ngOnInit() {
    this.loadFile();
  }

  // create file subscription
  loadFile() {
    this.translationUnits$ = this._fileUploadService.translationUnits$.subscribe((res) => {
      this.translationUnits = res;
    });
    this.fileInfo$ = this._fileUploadService.fileInfo$.subscribe((res) => {
      this.fileInfo = res;
    });
  }

  ngOnDestroy() {
    this.fileInfo$.unsubscribe();
    this.translationUnits$.unsubscribe();
  }
}
