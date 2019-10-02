// Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Material icons module
import { MatIconModule } from '@angular/material/icon';

// Components
import { DragAndDropComponent } from './components/drag-and-drop.component';

// Directives
import { DragAndDropDirective } from './directives/drag-and-drop.directive';

@NgModule({
    imports: [
        BrowserModule,
        MatIconModule
    ],
    declarations: [
        DragAndDropDirective,
        DragAndDropComponent
    ],
    exports: [
        DragAndDropDirective,
        DragAndDropComponent
    ]
})

export class DragAndDropModule { }
