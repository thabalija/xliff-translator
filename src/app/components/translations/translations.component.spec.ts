import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslationsComponent } from './translations.component';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FileUploadService } from '../../services/file-upload.service';
import { TranslationListService } from '../../services/translation-list.service';
import { FileDownloadService } from '../../services/file-download.service';
import { TranslationUnitsService } from '../../services/translation-units.service';
import { LocaleService } from '../../services/locale.service';

describe('TranslationsComponent', () => {
  let component: TranslationsComponent;
  let fixture: ComponentFixture<TranslationsComponent>;
  const oldResetTestingModule = TestBed.resetTestingModule;

  beforeAll(done => (async () => {
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
        FileDownloadService,
        TranslationListService,
        TranslationUnitsService,
        LocaleService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    await TestBed.compileComponents();

    // prevent Angular from resetting testing module
    TestBed.resetTestingModule = () => TestBed;
  })().then(done).catch(done.fail));

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

