export interface Episode {
  src: string;
  type: string;
}

export interface Playlist {
  sources: Episode[];
  thumbnail: string;
  name: string;
}

export interface VideoJsPlaylist extends Function {
  (playlist: Playlist, episodeIndex: number): void;
  autoadvance: (_: number) => void;
  next: () => void;
  previous: () => void;
  currentIndex: () => number;
}

export interface StaticConfigurations {
  controlBar?: {
    remainingTimeDisplay?: { displayNegative: boolean };
  };
  html5: any;
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
