export interface theme {
  name: string;
  value: string;
}

export interface VideoPlayerSettings {
  theme: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  pip: boolean;
  controls: boolean;
  hotkeys: boolean;
  enableNumbers: boolean;
  enableVolumeScroll: boolean;
  enableModifiersForNumbers: boolean;
  enableMute: boolean;
  enableFullscreen: boolean;
  seekStep: number;
  volumeStep: number;
}