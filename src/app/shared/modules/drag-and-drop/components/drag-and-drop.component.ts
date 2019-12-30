import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropComponent {
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  @Input() multiple: boolean;
  @Input() disabled: boolean;
  @Output() checkChange: EventEmitter<File[]> = new EventEmitter();

  public files: File[];
  public isDraggedOver: boolean;

  public openFileDialog(): void {
    const event = new MouseEvent('click', { bubbles: false });
    this.fileInput.nativeElement.dispatchEvent(event);
  }

  public onBrowseFiles(event: File[]): void {
    this.files = this.fileInput.nativeElement.files;
    this.checkChange.emit(this.files);
  }

  public onDropFiles(event: File[]): void {
    this.files = event;
    this.checkChange.emit(this.files);
  }

  public onDragOver(isDraggedOver: boolean) {
    this.isDraggedOver = isDraggedOver;
  }
}
