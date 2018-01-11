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
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { TranslationStatusComponent } from './components/translation-status/translation-status.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EditorComponent } from './components/editor/editor.component';

// App Components

// Services

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    TranslationStatusComponent,
    LayoutComponent,
    EditorComponent
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
  providers: [],
  entryComponents: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
