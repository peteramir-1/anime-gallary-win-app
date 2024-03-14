import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ElectronService } from 'src/app/core/services/electron.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'image-input',
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ImageInputComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageInputComponent implements ControlValueAccessor {
  @HostBinding('class') private readonly class =
    'flex w-full items-center justify-center';
  @HostBinding('attr.role') private readonly role = 'group';
  @HostBinding('attr.aria-label') private readonly ariaLabel =
    'fieldset for file path input';

  private readonly allowedFileExtension = ['bmp', 'png', 'jpg', 'gif', 'jpeg'];

  readonly id = `dropzone-file-${
    Math.floor(Math.random() * 1000) - Math.floor(Math.random() * 2000)
  }`;
  readonly value = signal<string | undefined>(undefined);
  readonly background = computed(
    () => this.value() && `background-image: url("${this.value()}")`
  );

  private readonly snackbar = inject(MatSnackBar);

  onChange: (path: string) => void;
  onTouched: () => void;
  isDisabled: boolean = false;

  constructor(
    private electronService: ElectronService,
    private utilsService: UtilsService
  ) {}

  writeValue(path: any): void {
    this.value.set(path);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setValue(filePath: string): void {
    this.value.set(filePath);
    this.onChange(filePath);
  }

  /**
   * This is an event handler for Click and keyboard (ENTER KEY) events
   * @param event Keyboard event or Mouse event
   */
  selectPictureFromDialog(event: Event): void {
    if ((event.target as HTMLElement).tagName === 'INPUT') return;

    this._windowFreeze();

    this.electronService
      .selectFile(this.allowedFileExtension)
      .then((path: string | false) => {
        if (!path) return;
        const validPath = this.utilsService.convertPathToValidPath(path);
        this.setValue(validPath);
      })
      .finally(() => this._windowRestore());
  }

  /**
   * This is an event handler for Drop event
   * @param event DropEvent
   */
  selectPictureFromDragAndDrop(dropEvent: DragEvent): void {
    if ((dropEvent.target as HTMLElement).tagName === 'INPUT') return;

    const file = dropEvent.dataTransfer.files[0];
    if (!file) return;

    const path = (file as File & { path: string }).path;

    const notAllowedFileExtensionError: Error = new Error(
      'File Extension is not supported'
    );
    notAllowedFileExtensionError.name = 'notAllowedFileExtensionError';

    try {
      const validPath = this.utilsService.convertPathToValidPath(path);
      const [_, extension] = /\.(\w+?)$/i.exec(validPath);

      if (this.allowedFileExtension.includes(extension)) {
        this.setValue(validPath);
        this._windowRestore();
      } else {
        throw notAllowedFileExtensionError;
      }
    } catch (err) {
      if (err.name === notAllowedFileExtensionError.name) {
        this.snackbar.open(err.message);
      } else {
        this.snackbar.open('Upload Folder is not supported');
      }
    }

    dropEvent.preventDefault();
    dropEvent.stopPropagation();
  }

  private _windowFreeze() {}

  private _windowRestore() {}
}
