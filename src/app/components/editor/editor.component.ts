import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FileDownloadService } from '../../services/file-download.service';
import { LocaleService } from '../../services/locale.service';
import { TranslationListService } from '../../services/translation-list.service';
import { TranslationUnitsService } from '../../services/translation-units.service';
import { FileInfo } from '../../shared/interfaces/file-info.interface';
import { Locale } from '../../shared/interfaces/locale.interface';
import { TranslationUnit } from '../../shared/interfaces/translation-unit.interface';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit {
  public fileInfo: FileInfo;
  public translationUnits: TranslationUnit[] = [];
  public paginatedTranslationUnits: TranslationUnit[] = [];
  public pageEvent: PageEvent = { pageIndex: 0, pageSize: 5, length: 0 };
  public pageSizeOptions = [5, 10, 25, 50];
  public languages: Locale[];
  public showUnits = 'all';
  private translationID: number;

  constructor(
    public snackBar: MatSnackBar,
    private fileDownloadService: FileDownloadService,
    private localeService: LocaleService,
    private route: ActivatedRoute,
    private translationListService: TranslationListService,
    private translationUnitsService: TranslationUnitsService
  ) {}

  ngOnInit() {
    this.translationID = Number(this.route.snapshot.paramMap.get('id'));
    this.languages = this.localeService.getLocale();
    this.fileInfo = this.translationListService.getTranslationInfo(this.translationID);
    this.translationUnits = this.translationUnitsService.getTraslationUnits(
      this.translationID
    );
    this.countTranslatedUnits();
    this.refreshTranslationUnits();
  }

  public saveChanges(): void {
    this.countTranslatedUnits();
    this.translationUnitsService.addTraslationUnits(
      this.translationID,
      this.translationUnits
    );
    this.translationListService.updateTranslationInfo(this.fileInfo);
  }

  private countTranslatedUnits(): void {
    let translatedUnitsCount = 0;
    this.translationUnits.forEach(unit => {
      if (unit.targetState.toLowerCase() === 'translated') {
        translatedUnitsCount++;
      }
    });
    if (this.fileInfo) {
      this.fileInfo.translatedUnits = translatedUnitsCount;
    }
  }

  public downloadFile(translationID: number): void {
    this.saveChanges();
    this.fileDownloadService.downloadFile(translationID);
  }

  public copy(text: string): void {
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
          duration: 2000
        });
      }
    } catch (err) {
      this.snackBar.open('Wild error occurred', 'close', {
        duration: 2000
      });
    }
    document.body.removeChild(textArea);
  }

  public focusTextarea(event: any): void {
    if (event.target.tagName.toLowerCase() === 'mat-card') {
      event.target.querySelector('textarea').focus();
    }
  }

  public onPageChange(event: PageEvent): void {
    this.pageEvent = event;
    this.refreshTranslationUnits();
  }

  public filterTranslations(showUnits: string): void {
    this.showUnits = showUnits;
    this.refreshTranslationUnits();
  }

  public refreshTranslationUnits(): void {
    let filteredUnits: TranslationUnit[];
    if (this.showUnits === 'all') {
      filteredUnits = this.translationUnits;
    } else if (this.showUnits === 'other') {
      filteredUnits = this.translationUnits.filter((el, i) => {
        const isNotNew =
          this.translationUnits[i].targetState.toLowerCase() !== 'initial';
        const isNotTranslated =
          this.translationUnits[i].targetState.toLowerCase() !== 'translated';
        const isOther = isNotNew && isNotTranslated;
        return isOther;
      });
    } else {
      filteredUnits = this.translationUnits.filter((el, i) => {
        return this.translationUnits[i].targetState === this.showUnits;
      });
    }
    this.paginatedTranslationUnits = filteredUnits.slice(
      this.pageEvent.pageIndex * this.pageEvent.pageSize,
      (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize
    );
  }
}
