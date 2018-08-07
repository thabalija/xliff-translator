import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../shared/modules/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FileUploadService } from '../../services/file-upload.service';
import { TranslationListService } from '../../services/translation-list.service';
import { FileDownloadService } from '../../services/file-download.service';
import { TranslationUnitsService } from '../../services/translation-units.service';
import { LocaleService } from '../../services/locale.service';
import { EditorComponent } from './editor.component';
import { TranslationUnit } from '../../shared/interfaces/translation-unit.interface';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
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

    // prevent Angular from resetting testing module
    TestBed.resetTestingModule = () => TestBed;
  })().then(done).catch(done.fail));

  afterAll(() => {
    // reinstate resetTestingModule method
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

  it('should load fileinfo from localstorage', () => {
    const translationList = [{id: 1}];
    component.translationID = 1;
    localStorage.setItem('translationList', JSON.stringify(translationList));
    component.loadTranslationInfo();
    fixture.detectChanges();
    expect(component.fileInfo.id).toBe(1);
  });

  it('should load translation units from localstorage', () => {
    component.translationID = 1;
    const translationUnit: TranslationUnit = {
      id: '1',
      source: 'Just testing',
      target: '',
      targetState: 'new',
      note: [],
      showNote: false
    };
    localStorage.setItem('1', JSON.stringify([translationUnit]));
    spyOn(component, 'countTranslatedUnits');
    spyOn(component, 'refreshTranslationUnits');
    component.loadTranslationUnits();
    fixture.detectChanges();
    expect(component.countTranslatedUnits).toHaveBeenCalledTimes(1);
    expect(component.refreshTranslationUnits).toHaveBeenCalledTimes(1);
    expect(component.translationUnits.length).toBe(1);
  });

  // TODO: write rest of tests

});
