export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type WindowType = 'default' | 'game' | 'media' | 'ai-tool' | 'winamp';

export interface WindowState {
  position: Position;
  size: Size;
  isMaximized: boolean;
  isMinimized: boolean;
  isDragging: boolean;
  zIndex: number;
  type: WindowType;
  isFullscreen?: boolean;
  isPlaying?: boolean;
  isMuted?: boolean;
  volume?: number;
  currentTime?: number;
  duration?: number;
  isResizable?: boolean;
  isAlwaysOnTop?: boolean;
}

export interface WindowProps {
  id: string;
  title: string;
  initialPosition: Position;
  initialSize: Size;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  content: React.ReactNode;
  type?: WindowType; // Add this line
  isResizable?: boolean;
  isAlwaysOnTop?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export interface WindowsContextType {
  bringToFront: (id: string) => void;
  zIndexes: Record<string, number>;
  setWindowState: (id: string, state: Partial<WindowState>) => void;
  getWindowState: (id: string) => WindowState | undefined;
  setAlwaysOnTop: (id: string, isAlwaysOnTop: boolean) => void;
  onBack: () => void;
}

export interface MediaControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
} 