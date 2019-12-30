import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FileUploadService } from '../../services/file-upload.service';
import { TranslationListService } from '../../services/translation-list.service';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { LayoutComponent } from './layout.component';

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

      TestBed.resetTestingModule = () => TestBed;
    })()
      .then(done)
      .catch(done.fail)
  );

  afterAll(() => {
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
});
