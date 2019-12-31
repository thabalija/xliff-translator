import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FileDownloadService } from '../../services/file-download.service';
import { FileUploadService } from '../../services/file-upload.service';
import { LocaleService } from '../../services/locale.service';
import { TranslationListService } from '../../services/translation-list.service';
import { TranslationUnitsService } from '../../services/translation-units.service';
import { FileInfo } from '../../shared/interfaces/file-info.interface';
import { TranslationUnit } from '../../shared/interfaces/translation-unit.interface';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  const oldResetTestingModule = TestBed.resetTestingModule;
  const fileInfo: FileInfo = {
    id: 1,
    sourceLang: 'en-US',
    totalUnits: 1
  };
  const translationUnit: TranslationUnit = {
    unitId: '1',
    source: 'Just testing',
    target: '',
    targetState: 'initial',
    note: [],
    showNote: false
  };

  beforeAll(done =>
    (async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          MaterialModule,
          NoopAnimationsModule,
          RouterTestingModule
        ],
        declarations: [EditorComponent],
        providers: [
          FileUploadService,
          FileDownloadService,
          TranslationListService,
          TranslationUnitsService,
          LocaleService
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();

      TestBed.resetTestingModule = () => TestBed;
    })()
      .then(done)
      .catch(done.fail)
  );

  afterAll(() => {
    TestBed.resetTestingModule = oldResetTestingModule;
    TestBed.resetTestingModule();
    localStorage.clear();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
