import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { filter, takeUntil, tap } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

import {
  GetVideoPlayerSettingsDocument,
  UpdateSettingsGQL,
} from 'src/app/graphql/generated/graphql';

import { themes } from './video-player-settings.model';
import { Subject } from 'rxjs';
import { AppOverlayContainer } from 'src/app/common/services/app-overlay-container.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('pageContainer') pageContainer: ElementRef;
  private readonly body = document.querySelector('body');
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
  formStyles = {
    group: 'flex flex-col gap-4 px-3',
    groupHeader: 'mb-2 font-bold text-lg',
    field: 'flex flex-row items-center px-3',
    label:
      'flex flex-row items-center basis-32 select-none text-sm font-semibold',
  };

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private matSnackbar: MatSnackBar,
    private updateSettingsGQL: UpdateSettingsGQL,
    private overlayContainerService: AppOverlayContainer
  ) {
    this.overlayContainerService.createContainerElement(this.body);
  }

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
          this.overlayContainerService.createContainerElement(
            this.pageContainer.nativeElement
          );
          this.matSnackbar
            .open('Updated!', 'dismiss', { duration: 8000 })
            .afterDismissed()
            .subscribe(() => {
              this.overlayContainerService.removeContainerElement();
              this.overlayContainerService.createContainerElement(this.body);
            });
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
