import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-drop',
  imports: [MatIconModule],
  templateUrl: './file-drop.html',
  styleUrl: './file-drop.scss',
  host: {
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class FileDrop {
  readonly disabled = input(false);
  readonly filesSelected = output<File[]>();

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  protected readonly files = signal<File[]>([]);
  protected readonly isDraggedOver = signal(false);

  protected openFileDialog(): void {
    if (this.disabled()) {
      return;
    }
    this.fileInput().nativeElement.click();
  }

  protected onBrowse(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.emitFiles(Array.from(inputElement.files ?? []));
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this.isDraggedOver.set(true);
    }
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggedOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggedOver.set(false);
    if (this.disabled()) {
      return;
    }
    this.emitFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  private emitFiles(files: File[]): void {
    this.files.set(files);
    this.filesSelected.emit(files);
  }
}
