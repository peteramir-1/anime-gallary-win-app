import {
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { filter, takeUntil, tap } from 'rxjs/operators';

import {
  GetVideoPlayerSettingsDocument,
  UpdateSettingsGQL,
} from 'src/app/core/services/graphql.service';

import { themes } from 'src/app/features/settings/models/video-player-settings.model';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  private readonly snackbar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly updateSettingsGQL = inject(UpdateSettingsGQL);

  private readonly destroyed$ = new Subject<void>();
  private savedSettings = this.activeRoute.snapshot.data.settings;
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
  readonly themes = themes;
  isSaveButtonDisabled = true;


  constructor(
  ) {}

  ngOnInit(): void {
    this.savedSettings = this.optionsForm.getRawValue();
    this.optionsForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this.toggleDisableForSavedButton(value);
      });
  }

  private toggleDisableForSavedButton(newOptionFomValue: any): void {
    this.isSaveButtonDisabled =
      JSON.stringify(newOptionFomValue) === JSON.stringify(this.savedSettings);
    this.isSaveButtonDisabled =
      this.isSaveButtonDisabled || !this.optionsForm.dirty;
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
    if(this.isSaveButtonDisabled === true) return;
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

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
