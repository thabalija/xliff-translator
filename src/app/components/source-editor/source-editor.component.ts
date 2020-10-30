import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileDownloadService } from '../../services/file-download.service';
import { FileUploadService } from '../../services/file-upload.service';
import { LocaleService } from '../../services/locale.service';
import { TranslationListService } from '../../services/translation-list.service';
import { TranslationUnitsService } from '../../services/translation-units.service';
import { FileInfo } from '../../shared/interfaces/file-info.interface';
import { Locale } from '../../shared/interfaces/locale.interface';
import { Note, TranslationUnit } from '../../shared/interfaces/translation-unit.interface';

@Component({
  selector: 'app-source-editor',
  templateUrl: './source-editor.component.html',
  styleUrls: ['./source-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceEditorComponent implements OnInit {
  public fileInfo: FileInfo;
  public translationUnits: Array<TranslationUnit> = [];
  public paginatedTranslationUnits: Array<TranslationUnit> = [];
  public pageEvent: PageEvent = { pageIndex: 0, pageSize: 5, length: 0 };
  public pageSizeOptions = [5, 10, 25, 50];
  public localeObject: object;

  constructor(
    public snackBar: MatSnackBar,
    private fileDownloadService: FileDownloadService,
    private localeService: LocaleService,
    private fileUploadService: FileUploadService,
    private translationUnitsService: TranslationUnitsService,
  ) {}

  ngOnInit() {
    this.fileInfo = this.fileUploadService.getFileInfo();
    this.translationUnits = this.translationUnitsService.getTraslationUnits();
    this.loadLocaleObject();
    this.refreshTranslationUnits();
  }

  private loadLocaleObject(): void {
    this.localeObject = this.localeService.getLocaleObject();
  }

  public get translationTitle(): string {
    return `${this.localeObject[this.fileInfo.sourceLang]}`;
  }

  public onUnitChange(unit: TranslationUnit): void {
    this.saveChanges();
  }

  public downloadFile(translationID: number): void {
    this.saveChanges();
    this.fileDownloadService.downloadFile(translationID);
  }

  public onPageChange(event: PageEvent): void {
    this.pageEvent = event;
    this.refreshTranslationUnits();
  }

  public refreshTranslationUnits(): void {
    this.paginatedTranslationUnits = this.translationUnits.slice(
      this.pageEvent.pageIndex * this.pageEvent.pageSize,
      (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize
    );
  }

  public getNote(notes: Array<Note>): string {
    return notes.map((noteObject: Note) => noteObject.note).join(', ');
  }

  private saveChanges(): void {
    // TODO
  }
}
