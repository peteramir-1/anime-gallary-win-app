import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageInputComponent } from './image-input.component';
import { ImageInputPlaceholderComponent } from './components/image-input-placeholder.component';
import { NgIconsModule } from '@ng-icons/core';
import { lucideUpload } from '@ng-icons/lucide';

@NgModule({
  declarations: [ImageInputComponent, ImageInputPlaceholderComponent],
  imports: [
    CommonModule,
    NgIconsModule.withIcons({ lucideUpload }),
  ],
  exports: [NgIconsModule, ImageInputComponent, ImageInputPlaceholderComponent],
})
export class ImageInputModule {}
