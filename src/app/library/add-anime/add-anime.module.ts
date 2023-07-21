import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AddAnimeComponent } from './add-anime.component';
import { AddAnimeRoutingModule } from './add-anime.routing';

import { NgIconsModule } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';

import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';

import { FilepathInputModule } from 'src/app/common/components/filepath-input/filepath-input.module';
import { FolderInputModule } from 'src/app/common/components/folder-input/folder-input.module';
import { NumInputModule } from 'src/app/common/components/num-input/num-input.module';

@NgModule({
  declarations: [AddAnimeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddAnimeRoutingModule,
    NgIconsModule.withIcons({
      heroArrowLeft,
    }),
    FilepathInputModule,
    FolderInputModule,
    MatSnackBarModule,
    NumInputModule,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        panelClass: 'matSnackbarClass',
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      },
    },
  ],
})
export class AddAnimeModule {}
