// Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Feature Modules
import { MaterialModule } from '../material/material.module';
import { DragAndDropModule } from '../drag-and-drop/drag-and-drop.module';

// Components
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AddTranslationDialogComponent } from './add-translation-dialog/add-translation-dialog.component';

// Services

@NgModule({
  declarations: [ConfirmDialogComponent, AddTranslationDialogComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DragAndDropModule
  ],
  exports: [DragAndDropModule],
  entryComponents: [ConfirmDialogComponent, AddTranslationDialogComponent]
})
export class SharedModule {}
