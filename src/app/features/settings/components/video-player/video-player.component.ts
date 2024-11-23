import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { filter, tap, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  GetVideoPlayerSettingsDocument,
  GetVideoPlayerSettingsQuery,
  UpdateSettingsGQL,
} from 'src/app/core/services/graphql.service';

import { themes } from 'src/app/features/settings/components/video-player/models/video-player.model';
import { MatSnackBar } from '@angular/material/snack-bar';

type OptionForm = Partial<{
  general: Partial<{
    theme: string;
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    pip: boolean;
    controls: boolean;
  }>;
  hotkeys: Partial<{
    hotkeys: boolean;
    enableNumbers: boolean;
    enableVolumeScroll: boolean;
    enableModifiersForNumbers: boolean;
    enableMute: boolean;
    enableFullscreen: boolean;
    seekStep: number;
    volumeStep: number;
  }>;
}>;

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit {
  private readonly snackbar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly updateSettingsGQL = inject(UpdateSettingsGQL);
  private readonly destroyRef = inject(DestroyRef);

  readonly themes = themes;

  private savedOptionsForm?: OptionForm;
  readonly isSaveButtonDisabled = signal<boolean>(true);

  private readonly routerReceivedSettings: GetVideoPlayerSettingsQuery['settings'] =
    this.activeRoute.snapshot.data.settings;

  readonly optionsForm = this.fb.group({
    general: this.fb.group({
      theme: this.fb.control<string>('custom-theme-1'),
      autoplay: this.fb.control<boolean>(false),
      loop: this.fb.control<boolean>(false),
      muted: this.fb.control<boolean>(false),
      pip: this.fb.control<boolean>(false),
      controls: this.fb.control<boolean>(true),
    }),
    hotkeys: this.fb.group({
      hotkeys: this.fb.control<boolean>(false),
      enableNumbers: this.fb.control<boolean>(false),
      enableVolumeScroll: this.fb.control<boolean>(false),
      enableModifiersForNumbers: this.fb.control<boolean>(false),
      enableMute: this.fb.control<boolean>(false),
      enableFullscreen: this.fb.control<boolean>(false),
      seekStep: this.fb.control<number>(1, [Validators.min(1)]),
      volumeStep: this.fb.control<number>(0.2, [
        Validators.min(0),
        Validators.max(1),
      ]),
    }),
  });

  constructor() {}

  /**
   * Initializes the component by setting form values and configuring form controls.
   * - Patches the form with values converted from the settings received from the router.
   * - Saves the initial form values for comparison purposes.
   * - Toggles the hotkey controls based on the initial hotkey settings.
   * - Subscribes to form value changes to update the save button's disabled state
   *   by comparing current form values with the saved initial values.
   */
  ngOnInit(): void {
    // Patch the options form with initial values from the router
    this.optionsForm.patchValue(
      this.convertSettingsToFormValues(this.routerReceivedSettings)
    );

    // Save initial form values for later comparison
    this.savedOptionsForm = this.convertSettingsToFormValues(
      this.routerReceivedSettings
    );

    // Toggle hotkey controls based on initial hotkey settings
    this.toggleHotkeyControls(this.routerReceivedSettings.hotkeys);

    // Subscribe to form value changes to manage the save button's state
    this.optionsForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef), // Ensure subscription is cleaned up on component destruction
        tap(() => {
          // Update the save button's disabled state by comparing form values
          this.isSaveButtonDisabled.set(
            this.compareObjectsValues(
              this.optionsForm.value,
              this.savedOptionsForm
            )
          );
        })
      )
      .subscribe();
  }

  /**
   * Converts video player settings from the received query format to form values.
   *
   * @param {GetVideoPlayerSettingsQuery['settings']} settings - The video player settings from the GraphQL query.
   * @returns {OptionForm} The form values for the video player settings.
   */
  private convertSettingsToFormValues(
    settings: GetVideoPlayerSettingsQuery['settings']
  ): OptionForm {
    return {
      general: {
        autoplay: settings.autoplay,
        theme: settings.theme,
        loop: settings.loop,
        muted: settings.muted,
        pip: settings.pip,
        controls: settings.controls,
      },
      hotkeys: {
        hotkeys: !settings.hotkeys,
        enableNumbers: !settings.enableNumbers,
        enableVolumeScroll: !settings.enableVolumeScroll,
        enableModifiersForNumbers: !settings.enableModifiersForNumbers,
        enableMute: !settings.enableMute,
        enableFullscreen: !settings.enableFullscreen,
        seekStep: settings.seekStep,
        volumeStep: settings.volumeStep,
      },
    };
  }

  /**
   * Recursively compares two objects and returns true if they are equal, false otherwise.
   * Equality is determined by checking if both objects have the same keys and values.
   * If the values are also objects, the function calls itself to compare them recursively.
   * If the values are not objects, the function uses the === operator to compare them.
   *
   * @param {any} obj1 - The first object to be compared.
   * @param {any} obj2 - The second object to be compared.
   * @returns {boolean} True if the objects are equal, false otherwise.
   */
  private compareObjectsValues(obj1: any, obj2: any): boolean {
    // Check if both are the same object
    if (obj1 === obj2) return true;

    // Check if either is null or not an object
    if (
      obj1 == null ||
      typeof obj1 !== 'object' ||
      obj2 == null ||
      typeof obj2 !== 'object'
    ) {
      return false;
    }

    // Get object keys
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if keys length is the same
    if (keys1.length !== keys2.length) return false;

    // Compare keys and values recursively
    for (const key of keys1) {
      if (
        !keys2.includes(key) ||
        !this.compareObjectsValues(obj1[key], obj2[key])
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Disables/enables the options form controls for the hotkey settings based on
   * the provided boolean value. If the value is false, all hotkey controls except
   * the first one (the hotkeys toggle switch) are disabled. If the value is true,
   * all hotkey controls except the first one are enabled.
   *
   * @param {boolean} hotkeysEnabled - The value of the hotkeys toggle switch.
   * @returns {void}
   */
  toggleHotkeyControls(hotkeysEnabled: boolean): void {
    if (!hotkeysEnabled) {
      Object.values(this.optionsForm.controls.hotkeys.controls).forEach(
        (control, i) => {
          if (i === 0) return;
          control.disable();
        }
      );
    } else {
      Object.values(this.optionsForm.controls.hotkeys.controls).forEach(
        (control, i) => {
          if (i === 0) return;
          control.enable();
        }
      );
    }
  }

  /**
   * Updates the video player settings with the values from the options form.
   * @returns {void}
   */
  save(): void {
    if (this.isSaveButtonDisabled() === true) return;
    this.updateSettingsGQL
      .mutate(
        {
          updateSettings: {
            ...this.optionsForm.get('general').value,
            ...this.optionsForm.get('hotkeys').value,
          },
        },
        { refetchQueries: [{ query: GetVideoPlayerSettingsDocument }] }
      )
      .pipe(
        filter(() => this.optionsForm.valid),
        tap(() => {
          this.optionsForm.markAsUntouched();
          this.optionsForm.markAsPristine();
          this.optionsForm.updateValueAndValidity();
          this.snackbar.open('Updated!', 'dismiss');
        }),
        finalize(() => {
          this.savedOptionsForm = this.optionsForm.value;
          this.isSaveButtonDisabled.set(true);
        })
      )
      .subscribe();
  }
}
