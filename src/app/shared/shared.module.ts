import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OnOffInputModule } from 'src/app/shared/modules/on-off-input/on-off-input.module';
import { CheckboxInputModule } from 'src/app/shared/modules/checkbox-input/checkbox-input.module';

import { AnimeCardModule } from 'src/app/shared/modules/anime-card/anime-card.module';
import { FilepathInputModule } from 'src/app/shared/modules/filepath-input/filepath-input.module';
import { FolderInputModule } from 'src/app/shared/modules/folder-input/folder-input.module';
import { NumInputModule } from 'src/app/shared/modules/num-input/num-input.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { WidgetContainerModule } from './directives/widget-container/widget-container.module';
import { ScrollableModule } from './directives/scrollable/scrollable.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FormFieldModule } from 'src/app/shared/modules/inputs/form-field/form-field.module';
import { NumberInputModule } from 'src/app/shared/modules/inputs/number-input/number-input.module';
import { RadioWrapperModule } from 'src/app/shared/modules/inputs/radio-wrapper/radio-wrapper.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Material Module
    MatTooltipModule,
    MatSnackBarModule,

    // Widgets Module
    AnimeCardModule,
    OnOffInputModule,
    CheckboxInputModule,

    // Input Modules
    FormFieldModule,
    RadioWrapperModule,
    NumberInputModule,
    FilepathInputModule,
    FolderInputModule,
    NumInputModule,

    WidgetContainerModule,
    ScrollableModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    FormFieldModule,
    RadioWrapperModule,
    NumberInputModule,

    MatTooltipModule,
    MatSnackBarModule,

    AnimeCardModule,
    OnOffInputModule,
    CheckboxInputModule,
    FilepathInputModule,
    FolderInputModule,
    NumInputModule,

    WidgetContainerModule,
    ScrollableModule,
  ],
})
export class SharedModule {}
