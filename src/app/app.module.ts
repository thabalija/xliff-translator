import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SourceEditorComponent } from './components/source-editor/source-editor.component';
import { TranslationsComponent } from './components/translations/translations.component';
import { MaterialModule } from './shared/modules/material/material.module';
import { AppRoutingModule } from './shared/modules/routing/app-routing.module';
import { SharedModule } from './shared/modules/shared/shared.module';

@NgModule({
    declarations: [
        AppComponent,
        FileUploadComponent,
        LayoutComponent,
        EditorComponent,
        SourceEditorComponent,
        TranslationsComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        MaterialModule,
        SharedModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
