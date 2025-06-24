export interface Windows95DesktopProps {
  onBack: () => void;
}

export interface WindowProps {
  id: string;
  title: string;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  content: React.ReactNode;
  className?: string;
} 