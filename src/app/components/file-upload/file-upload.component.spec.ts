import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FileUploadComponent } from './file-upload.component';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FileUploadService } from '../../services/file-upload.service';
import { LocaleService } from '../../services/locale.service';
import { TranslationListService } from '../../services/translation-list.service';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
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
      declarations: [FileUploadComponent],
      providers: [
        FileUploadService,
        TranslationListService,
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
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set language locales', () => {
    component.loadLanguages();
    fixture.detectChanges();
    expect(component.languages.length).toBeGreaterThan(0);
  });

  // TODO: write tests

});

