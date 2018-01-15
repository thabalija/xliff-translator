// Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Feature Modules
import { MaterialModule } from './shared/modules/material/material.module';

// Routing Modules
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './shared/modules/routing/app-routing.module';

// Root Component
import { AppComponent } from './app.component';

// App Components
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EditorComponent } from './components/editor/editor.component';
import { FileInfoComponent } from './components/file-info/file-info.component';

// Services
import { FileUploadService } from './services/file-upload.service';
import { TranslationStatusService } from './services/translation-status.service';
import { FileDownloadComponent } from './components/file-download/file-download.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    LayoutComponent,
    EditorComponent,
    FileInfoComponent,
    FileDownloadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    FileUploadService,
    TranslationStatusService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
