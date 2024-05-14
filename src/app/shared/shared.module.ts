import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AnimeCardModule } from 'src/app/shared/modules/anime-card/anime-card.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { WidgetContainerModule } from './directives/widget-container/widget-container.module';
import { ScrollableModule } from './directives/scrollable/scrollable.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FormFieldModule } from 'src/app/shared/modules/inputs/form-field/form-field.module';
import { NumberInputModule } from 'src/app/shared/modules/inputs/number-input/number-input.module';
import { RadioWrapperModule } from 'src/app/shared/modules/inputs/radio-wrapper/radio-wrapper.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Material Module
    MatTooltipModule,
    MatSnackBarModule,

    // Widgets Module
    AnimeCardModule,

    // Input Modules
    FormFieldModule,
    RadioWrapperModule,
    NumberInputModule,

    // Layout Module
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

    WidgetContainerModule,
    ScrollableModule,
  ],
})
export class SharedModule {}
