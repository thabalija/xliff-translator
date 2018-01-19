// Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Feature Modules
import { MaterialModule } from './shared/modules/material/material.module';
import { SharedModule } from './shared/modules/shared/shared.module';

// Routing Modules
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './shared/modules/routing/app-routing.module';

// Root Component
import { AppComponent } from './app.component';

// App Components
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EditorComponent } from './components/editor/editor.component';

// Services
import { FileUploadService } from './services/file-upload.service';
import { TranslationsComponent } from './components/translations/translations.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    LayoutComponent,
    EditorComponent,
    TranslationsComponent
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
    FileUploadService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
