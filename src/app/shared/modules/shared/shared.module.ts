import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DragAndDropModule } from '../drag-and-drop/drag-and-drop.module';
import { MaterialModule } from '../material/material.module';
import { AddTranslationDialogComponent } from './add-translation-dialog/add-translation-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

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
