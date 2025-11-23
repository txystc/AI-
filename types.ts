export interface ImageState {
  file: File | null;
  previewUrl: string | null;
}

export interface GenerationConfig {
  sceneImage: File;
  rugImage: File;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}