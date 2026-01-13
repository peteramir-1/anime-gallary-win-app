import { Component } from '@angular/core';

@Component({
    selector: 'image-input-placeholder',
    template: `<article
    class="flex h-full flex-col items-center justify-center pb-6 pt-5">
    <ng-icon class="mb-3 text-2xl text-gray-400" name="lucideUpload"></ng-icon>
    <p class="mb-2 text-base text-gray-500 dark:text-gray-400">Anime Picture</p>
    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
      <span class="font-semibold">Click to upload</span> or drag and drop
    </p>
    <p class="text-xs text-gray-500 dark:text-gray-400">BMP, PNG, JPG or GIF</p>
  </article>`,
    standalone: false
})
export class ImageInputPlaceholderComponent {}
