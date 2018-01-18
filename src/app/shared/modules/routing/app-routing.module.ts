import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LayoutComponent } from './../../../components/layout/layout.component';
import { FileUploadComponent } from './../../../components/file-upload/file-upload.component';
import { TranslationsComponent } from './../../../components/translations/translations.component';
import { EditorComponent } from './../../../components/editor/editor.component';

const routes: Routes = [
  { path: '', component: LayoutComponent},
  { path: '*', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
