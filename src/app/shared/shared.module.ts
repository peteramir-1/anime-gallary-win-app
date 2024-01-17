import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OnOffInputModule } from 'src/app/shared/modules/on-off-input/on-off-input.module';
import { CheckboxInputModule } from 'src/app/shared/modules/checkbox-input/checkbox-input.module';
import { NumberInputModule } from 'src/app/shared/modules/number-input/number-input.module';

import { AnimeCardModule } from 'src/app/shared/modules/anime-card/anime-card.module';
import { FilepathInputModule } from 'src/app/shared/modules/filepath-input/filepath-input.module';
import { FolderInputModule } from 'src/app/shared/modules/folder-input/folder-input.module';
import { NumInputModule } from 'src/app/shared/modules/num-input/num-input.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppOverlayContainer } from '../core/services/app-overlay-container.service';
import { APP_SNACK_BAR_DEFAULT_OPTIONS } from './models/app-snackbar.model';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatTooltipModule,
    MatSnackBarModule,

    AnimeCardModule,
    OnOffInputModule,
    CheckboxInputModule,
    NumberInputModule,
    FilepathInputModule,
    FolderInputModule,
    NumInputModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,

    MatTooltipModule,
    MatSnackBarModule,

    AnimeCardModule,
    OnOffInputModule,
    CheckboxInputModule,
    NumberInputModule,
    FilepathInputModule,
    FolderInputModule,
    NumInputModule,
    FormsModule,
  ],
  providers: [
    {
      provide: OverlayContainer,
      useExisting: AppOverlayContainer,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: APP_SNACK_BAR_DEFAULT_OPTIONS,
    },
  ],
})
export class SharedModule {}
