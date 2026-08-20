import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ProjectStore } from './project-store';
import { ConfirmDialog } from '../shared/ui/confirm-dialog/confirm-dialog';
import { ConfirmDialogData } from '../shared/ui/confirm-dialog/confirm-dialog-data';

export const projectGuard: CanActivateFn = () => {
  const store = inject(ProjectStore);
  const router = inject(Router);
  return store.hasProject() ? true : router.createUrlTree(['/']);
};

export interface UnsavedComponent {
  hasUnsavedChanges(): boolean;
}

export const unsavedGuard: CanDeactivateFn<UnsavedComponent> = (component) => {
  if (!component.hasUnsavedChanges()) {
    return true;
  }

  const dialog = inject(MatDialog);
  return dialog
    .open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Leave editor',
        content: 'You have unsaved changes. Leave this page anyway?',
        confirm: 'Leave',
      } satisfies ConfirmDialogData,
    })
    .afterClosed()
    .pipe(map((confirmed) => confirmed === true));
};
