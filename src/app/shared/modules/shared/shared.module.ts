// Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Feature Modules
import { MaterialModule } from '../material/material.module';
import { DragAndDropModule } from '../drag-and-drop/drag-and-drop.module';

// Components
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';

// Services

@NgModule({
    declarations: [
        ConfirmDialogComponent,
        SettingsDialogComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        DragAndDropModule
    ],
    exports: [
        DragAndDropModule
    ],
    entryComponents: [
        ConfirmDialogComponent,
        SettingsDialogComponent
    ]
})

export class SharedModule { }
