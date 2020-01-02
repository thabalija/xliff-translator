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
import { MaterialModule } from '../../shared/modules/material/material.module';
import { TranslationsComponent } from './translations.component';

const baseFileInfo = {
  fileName: 'Test_file.xml',
  sourceLang: 'en-US',
  totalUnits: 1,
  translatedUnits: 0,
};

describe('TranslationsComponent', () => {
  let component: TranslationsComponent;
  let fixture: ComponentFixture<TranslationsComponent>;
  const oldResetTestingModule = TestBed.resetTestingModule;

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
        declarations: [TranslationsComponent],
        providers: [
          FileUploadService,
          { provide: FileUploadService,
            useValue: {
              getFileInfo: () => baseFileInfo,
              deleteFile: () => {},
            },
          },
          FileDownloadService,
          TranslationListService,
          TranslationUnitsService,
          LocaleService,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });
      await TestBed.compileComponents();

      // prevent Angular from resetting testing module
      TestBed.resetTestingModule = () => TestBed;
    })()
      .then(done)
      .catch(done.fail)
  );

  afterAll(() => {
    // reinstate resetTestingModule method
    TestBed.resetTestingModule = oldResetTestingModule;
    TestBed.resetTestingModule();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: write tests
});
