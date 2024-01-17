export interface Episode {
  src: string;
  type: string;
}

export interface Playlist {
  sources: Episode[];
  thumbnail: string;
  name: string;
}

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

export interface StaticConfigurations {
  controlBar?: {
    remainingTimeDisplay?: { displayNegative: boolean };
  };
  preload?: string;
}

export interface HotKeys {
  volumeStep?: number;
  seekStep?: number;
  enableMute?: boolean;
  enableNumbers?: boolean;
  enableModifiersForNumbers?: boolean;
  enableVolumeScroll?: boolean;
  enableHoverScroll?: boolean;
  enableFullscreen?: boolean;
}

export interface VideoPlayerConfigurations {
  controls?: boolean;
  height?: string | number;
  width?: string | number;
  autoplay?: boolean | string;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
  metadata?: any;
  src?: string;
  autoSetup?: boolean;
  responsive?: boolean;
  restoreEl?: boolean;
  sources?: Episode[];
  userActions?: {
    click?: boolean | ((e: any) => void);
    doubleClick?: boolean | ((e: any) => void);
    hotkeys?:
      | boolean
      | ((e: any) => void)
      | {
          fullscreenKey: (e: any) => void;
          muteKey: (e: any) => void;
          playPauseKey: (e: any) => void;
        };
  };
  'vtt.js'?: string;
  controlBar?: {
    remainingTimeDisplay?: { displayNegative: boolean };
    pictureInPictureToggle?: boolean;
  };
  children?: string[] | { [component: string]: any };
  plugins?: {
    hotkeys?: HotKeys;
  };
}
