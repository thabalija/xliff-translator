import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { DragAndDropComponent } from './components/drag-and-drop.component';
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
export class DragAndDropModule {}
