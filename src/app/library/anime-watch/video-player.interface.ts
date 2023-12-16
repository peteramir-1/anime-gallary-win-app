export interface Episode {
  src: string;
  type: string;
}

export interface Playlist {
  sources: Episode[];
  thumbnail: string;
  name: string;
}

export interface HotKeys {
  volumeStep?: number;
  seekStep?: number;
  enableNumbers?: boolean;
  enableModifiersForNumbers?: boolean;
  enableVolumeScroll?: boolean;
  enableMute?: boolean;
  enableHoverScroll?: boolean;
  enableFullscreen?: boolean;
  alwaysCaptureHotkeys?: boolean;
  enableInactiveFocus?: boolean;
  skipInitialFocus?: boolean;
  captureDocumentHotkeys?: boolean;
  documentHotkeysFocusElementFilter?: (e: HTMLElement) => boolean;
  enableJogStyle?: boolean;
}

export interface DynamicConfigurations {
  controls?: boolean;
  height?: string | number;
  width?: string | number;
  autoplay?: boolean | string;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
  preload?: string;
  metadata?: any;
  src?: string;
  aspectRatio?: string;
  audioOnlyMode?: boolean;
  audioPosterMode?: boolean;
  autoSetup?: boolean;
  responsive?: boolean;
  restoreEl?: boolean;
  skipButtons?: {
    forward: number;
    backward: number;
  };
  sources?: Episode[];
  suppressNotSupportedError?: boolean;
  techCanOverridePoster?: boolean;
  techOrder?: boolean;
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
