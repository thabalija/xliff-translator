import { Directive, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
})

export class DragAndDropDirective {

  @Output() droppedFile: EventEmitter<File[]> = new EventEmitter();
  @Output() draggingOver: EventEmitter<boolean> = new EventEmitter();

  files: File[];

  constructor() { }

  @HostListener('dragover', ['$event']) public onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.draggingOver.emit(true);
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this.draggingOver.emit(false);
  }

  @HostListener('drop', ['$event']) public onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.files = event.dataTransfer.files;
    if (this.files.length > 0) {
      this.droppedFile.emit(this.files);
    }
    this.draggingOver.emit(false);
  }

}
