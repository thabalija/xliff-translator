import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationStatusComponent } from './translation-status.component';

describe('TranslationStatusComponent', () => {
  let component: TranslationStatusComponent;
  let fixture: ComponentFixture<TranslationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
