// Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Feature Modules
import { MaterialModule } from '../material/material.module';

// Components
import { InputFileComponent } from './input-file/input-file.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';

// Services

@NgModule({
    declarations: [
        InputFileComponent,
        ConfirmDialogComponent,
        SettingsDialogComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    entryComponents: [
        ConfirmDialogComponent,
        SettingsDialogComponent
    ]
})

export class SharedModule { }
