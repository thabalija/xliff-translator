import { Component, Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    templateUrl: './settings-dialog.component.html'
})
export class SettingsDialogComponent {

    localeArray = [];

    constructor(
        public dialogRef: MatDialogRef<SettingsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.localeArray = data.localeArray;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}