import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilepathInputComponent } from './filepath-input.component';
import { FormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';

@NgModule({
  declarations: [FilepathInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgIconsModule.withIcons({
      heroXMark,
    }),
  ],
  exports: [FilepathInputComponent],
})
export class FilepathInputModule {}
