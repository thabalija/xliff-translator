import { Component, Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    templateUrl: './add-translation-dialog.component.html'
})
export class AddTranslationDialogComponent {

    localeArray = [];

    constructor(
        public dialogRef: MatDialogRef<AddTranslationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.localeArray = data.localeArray;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
