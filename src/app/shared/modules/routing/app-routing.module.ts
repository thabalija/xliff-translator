import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from '../../../components/editor/editor.component';
import { FileUploadComponent } from '../../../components/file-upload/file-upload.component';
import { LayoutComponent } from '../../../components/layout/layout.component';
import { TranslationsComponent } from '../../../components/translations/translations.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: FileUploadComponent },
      { path: 'translations', component: TranslationsComponent },
      { path: 'edit-translation/:id', component: EditorComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
