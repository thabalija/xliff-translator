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
import { FileDownloadService } from './services/file-download.service';
import { FileUploadService } from './services/file-upload.service';
import { LocaleService } from './services/locale.service';
import { TranslationListService } from './services/translation-list.service';
import { TranslationUnitsService } from './services/translation-units.service';
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
  providers: [
    FileUploadService,
    FileDownloadService,
    TranslationListService,
    LocaleService,
    TranslationUnitsService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
