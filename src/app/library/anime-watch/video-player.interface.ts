export interface Episode {
  src: string;
  type: string;
}

export interface Playlist {
  sources: Episode[];
  thumbnail: string;
  name: string;
}

export interface DynamicConfigurations {
  controls?: boolean;
  autoplay?: boolean;
  controlBar?: {
    remainingTimeDisplay?: { displayNegative: boolean };
    pictureInPictureToggle?: boolean;
  };
  preload?: string;
  plugins?: {
    hotkeys?: {
      volumeStep: number;
      seekStep: number;
      enableModifiersForNumbers: boolean;
    };
  };
}
