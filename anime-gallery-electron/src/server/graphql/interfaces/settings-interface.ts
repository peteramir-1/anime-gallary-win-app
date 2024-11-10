export interface Settings {
  id: number;
  theme:
    | 'custom-theme-1'
    | 'vjs-theme-forest'
    | 'vjs-theme-sea'
    | 'vjs-theme-fantasy'
    | 'vjs-theme-city';
  volumeStep?: number | null;
  seekStep?: number | null;
  poster?: string | null;
  skipButtonForward?: number | null;
  skipButtonBackward?: number | null;
  preload?: string | null;
  src?: string | null;
  aspectRatio?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  darkMode?: string | null;
  skipButton?: boolean | null;
  audioOnlyMode?: boolean | null;
  audioPosterMode?: boolean | null;
  remainingTimeDisplayDisplayNegative?: boolean | null;
  hotkeys?: boolean | null;
  enableMute?: boolean | null;
  enableVolumeScroll?: boolean | null;
  enableHoverScroll?: boolean | null;
  enableFullscreen?: boolean | null;
  enableNumbers?: boolean | null;
  enableModifiersForNumbers?: boolean | null;
  alwaysCaptureHotkeys?: boolean | null;
  enableInactiveFocus?: boolean | null;
  skipInitialFocus?: boolean | null;
  pip?: boolean | null;
  controls?: boolean | null;
  autoplay?: boolean | null;
  loop?: boolean | null;
  muted?: boolean | null;
}

export type RequiredDBSettingsFields = 'id' | 'theme' | 'createdAt';
export type BooleanDBSettingsFields =
  | 'darkMode'
  | 'enableMute'
  | 'enableVolumeScroll'
  | 'enableHoverScroll'
  | 'enableFullscreen'
  | 'enableNumbers'
  | 'enableModifiersForNumbers'
  | 'alwaysCaptureHotkeys'
  | 'enableInactiveFocus'
  | 'skipInitialFocus'
  | 'pip'
  | 'controls'
  | 'autoplay'
  | 'loop'
  | 'muted'
  | 'skipButton'
  | 'audioOnlyMode'
  | 'audioPosterMode'
  | 'remainingTimeDisplayDisplayNegative'
  | 'hotkeys';

interface RequiredDBSettingsInterface {
  id: number;
  theme:
    | 'custom-theme-1'
    | 'vjs-theme-forest'
    | 'vjs-theme-sea'
    | 'vjs-theme-fantasy'
    | 'vjs-theme-city';
  createdAt: string;
}

interface BooleanDBSettingsInterface {
  darkMode: number | null;
  enableMute: number | null;
  enableVolumeScroll: number | null;
  enableHoverScroll: number | null;
  enableFullscreen: number | null;
  enableNumbers: number | null;
  enableModifiersForNumbers: number | null;
  alwaysCaptureHotkeys: number | null;
  enableInactiveFocus: number | null;
  skipInitialFocus: number | null;
  pip: number | null;
  controls: number | null;
  autoplay: number | null;
  loop: number | null;
  muted: number | null;
  skipButton: number | null;
  audioOnlyMode: number | null;
  audioPosterMode: number | null;
  remainingTimeDisplayDisplayNegative: number | null;
  hotkeys: number | null;
}

export type sqliteSettingsInterface = Required<
  Omit<Settings, RequiredDBSettingsFields | BooleanDBSettingsFields> &
    RequiredDBSettingsInterface &
    BooleanDBSettingsInterface
>;
