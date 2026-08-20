import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { projectGuard, unsavedGuard } from './core/project.guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/upload/upload').then((m) => m.Upload),
      },
      {
        path: 'translations',
        loadComponent: () => import('./features/translations/translations').then((m) => m.Translations),
        canActivate: [projectGuard],
      },
      {
        path: 'edit-translation/:id',
        loadComponent: () => import('./features/editor/editor').then((m) => m.Editor),
        canActivate: [projectGuard],
        canDeactivate: [unsavedGuard],
      },
      {
        path: 'edit-source-translation',
        loadComponent: () => import('./features/source-editor/source-editor').then((m) => m.SourceEditor),
        canActivate: [projectGuard],
        canDeactivate: [unsavedGuard],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
