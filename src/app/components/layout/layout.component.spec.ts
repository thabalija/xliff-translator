import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LayoutComponent } from './layout.component';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FileUploadService } from '../../services/file-upload.service';
import { TranslationListService } from '../../services/translation-list.service';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
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
        declarations: [LayoutComponent],
        providers: [FileUploadService, TranslationListService],
        schemas: [NO_ERRORS_SCHEMA]
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
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if file exist in localstorage', () => {
    localStorage.setItem('fileInfo', JSON.stringify(true));
    component.checkIfFileExist();
    fixture.detectChanges();
    expect(component.isUploadedFile).toBe(true);
  });
});
