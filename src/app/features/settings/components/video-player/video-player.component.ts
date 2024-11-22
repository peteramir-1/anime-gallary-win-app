import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { filter, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  GetVideoPlayerSettingsDocument,
  UpdateSettingsGQL,
} from 'src/app/core/services/graphql.service';

import { themes } from 'src/app/features/settings/models/video-player-settings.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  private savedSettings = this.activeRoute.snapshot.data.settings;

  readonly isSaveButtonDisabled = signal<boolean>(true);

  readonly optionsForm = this.fb.group({
    general: this.fb.group({
      theme: this.fb.control<string>(this.savedSettings?.theme),
      autoplay: this.fb.control<boolean>(this.savedSettings?.autoplay),
      loop: this.fb.control<boolean>(this.savedSettings?.loop),
      muted: this.fb.control<boolean>(this.savedSettings?.muted),
      pip: this.fb.control<boolean>(this.savedSettings?.pip),
      controls: this.fb.control<boolean>(this.savedSettings?.controls),
    }),
    hotkeys: this.fb.group({
      hotkeys: this.fb.control<boolean>(this.savedSettings?.hotkeys),
      enableNumbers: this.fb.control<boolean>({
        value: this.savedSettings?.enableNumbers,
        disabled: !this.savedSettings?.hotkeys,
      }),
      enableVolumeScroll: this.fb.control({
        value: this.savedSettings?.enableVolumeScroll,
        disabled: !this.savedSettings?.hotkeys,
      }),
      enableModifiersForNumbers: this.fb.control({
        value: this.savedSettings?.enableModifiersForNumbers,
        disabled: !this.savedSettings?.hotkeys,
      }),
      enableMute: this.fb.control({
        value: this.savedSettings?.enableMute,
        disabled: !this.savedSettings?.hotkeys,
      }),
      enableFullscreen: this.fb.control<boolean>({
        value: this.savedSettings?.enableFullscreen,
        disabled: !this.savedSettings?.hotkeys,
      }),
      seekStep: this.fb.control<number>(
        {
          value: this.savedSettings?.seekStep,
          disabled: !this.savedSettings?.hotkeys,
        },
        [Validators.min(1)]
      ),
      volumeStep: this.fb.control<number>(
        {
          value: this.savedSettings?.volumeStep,
          disabled: !this.savedSettings?.hotkeys,
        },
        [Validators.min(0), Validators.max(1)]
      ),
    }),
  });

  constructor(
  ) {}

  ngOnInit(): void {
    this.savedSettings = this.optionsForm.getRawValue();
    this.optionsForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.toggleDisableForSavedButton(value);
      });
  }

  private toggleDisableForSavedButton(newOptionFomValue: any): void {
    this.isSaveButtonDisabled.set(
      JSON.stringify(newOptionFomValue) === JSON.stringify(this.savedSettings)
    );
    this.isSaveButtonDisabled.update(
      isSaveButtonDisabled => isSaveButtonDisabled || !this.optionsForm.dirty
    );
  }

  toggleDisableForHotkeyControls(hotkeysEnabled: boolean): void {
    console.log(hotkeysEnabled);
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

  themeTrackByFn(_, theme: { value: string }): string {
    return theme.value;
  }

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
          this.savedSettings = this.optionsForm.value;
        })
      )
      .subscribe();
  }
}
