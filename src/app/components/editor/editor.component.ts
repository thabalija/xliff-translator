import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { MatSnackBar, PageEvent, MatSelectChange } from '@angular/material';
import { LocaleService } from './../../services/locale.service';
import { FileDownloadService } from './../../services/file-download.service';
import { FileUploadService } from './../../services/file-upload.service';
import { TranslationUnitsService } from './../../services/translation-units.service';
import { Locale } from './../../shared/interfaces/locale.interface';
import { FileInfo } from './../../shared/interfaces/file-info.interface';
import { TranslationUnit } from './../../shared/interfaces/translation-unit.interface';
import { TranslationListService } from '../../services/translation-list.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  translationID: number;
  fileInfo: FileInfo;
  translationUnits: TranslationUnit[] = [];
  paginatedTranslationUnits: TranslationUnit[] = [];
  pageEvent: PageEvent = { pageIndex: 0, pageSize: 5, length: 0 };
  pageSizeOptions = [5, 10, 25, 50];
  languages: Locale[];
  showUnits = 'all';

  constructor(
    private route: ActivatedRoute,
    private _fileUploadService: FileUploadService,
    private _fileDownloadService: FileDownloadService,
    private _localeService: LocaleService,
    private _translationUnitsService: TranslationUnitsService,
    private _translationListService: TranslationListService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.translationID = Number(this.route.snapshot.paramMap.get('id'));
    this.loadLanguages();
    this.loadTranslationInfo();
    this.loadTranslationUnits();
  }

  // loads locale in select
  loadLanguages(): void {
    this.languages = this._localeService.getLocale();
  }

  // get translation info from localstorage
  loadTranslationInfo(): void {
    this.fileInfo = this._translationListService.getTranslationInfo(this.translationID);
  }

  // get translation units from localstorage
  loadTranslationUnits(): void {
    this.translationUnits = this._translationUnitsService.getTraslationUnits(this.translationID);
    this.countTranslatedUnits();
    this.refreshTranslationUnits();
  }

  // save changes to localstorage
  saveChanges(): void {
    this.countTranslatedUnits();
    this._translationUnitsService.addTraslationUnits(this.translationID, this.translationUnits);
    this._translationListService.updateTranslationInfo(this.fileInfo);
  }

  // count translated units marked as translated
  countTranslatedUnits(): void {
    let translatedUnitsCount = 0;
    this.translationUnits.forEach(unit => {
      if (unit.targetState === 'translated') {
        translatedUnitsCount++;
      }
    });
    this.fileInfo.translatedUnits = translatedUnitsCount;
  }

  // download file
  downloadFile(translationID: number): void {
    this.saveChanges();
    this._fileDownloadService.downloadFile(translationID);
  }

  // copies input text to clipboard
  copy(text): void {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.snackBar.open('Source text copied', 'close', {
          duration: 2000,
        });
      }
    } catch (err) {
      this.snackBar.open('Wild error occurred', 'close', {
        duration: 2000,
      });
    }
    document.body.removeChild(textArea);
  }

  // focus textarea on mat-card click
  focusTextarea(event): void {
    if (event.target.tagName.toLowerCase() === 'mat-card') {
      event.target.querySelector('textarea').focus();
    }
  }

  // slice translation units on pagination event
  onPageChange(event: PageEvent): void {
    this.pageEvent = event;
    this.refreshTranslationUnits();
  }

  // filter translation units on selection event (show all/new/translated)
  filterTranslations(showUnits: string): void {
    this.showUnits = showUnits;
    this.refreshTranslationUnits();
  }

  // filter and slice
  refreshTranslationUnits(): void {
    let filteredUnits: TranslationUnit[];
    if (this.showUnits === 'all') {
      filteredUnits = this.translationUnits;
    } else {
      filteredUnits = this.translationUnits.filter((el, i) => {
        return this.translationUnits[i].targetState === this.showUnits;
      });
    }
    this.paginatedTranslationUnits = filteredUnits.slice(
      this.pageEvent.pageIndex * this.pageEvent.pageSize,
      (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize);
  }

}
