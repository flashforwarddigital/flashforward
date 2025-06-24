import { useState, useRef, useCallback, useEffect } from 'react';
import { Position, Size, WindowState, WindowType } from '../types/windows';

interface UseWindowManagerProps {
  id: string;
  initialPosition: Position;
  initialSize: Size;
  onMinimize: () => void;
  bringToFront: (id: string) => void;
  type: WindowType;
}

export const useWindowManager = ({
  id,
  initialPosition,
  initialSize,
  onMinimize,
  bringToFront,
  type
}: UseWindowManagerProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number>();
  
  const [windowState, setWindowState] = useState<WindowState>({
    position: initialPosition,
    size: initialSize,
    isMaximized: false,
    isMinimized: false,
    isDragging: false,
    zIndex: 0,
    type: type
  });

  const [preMaximizeState, setPreMaximizeState] = useState<{position: Position, size: Size} | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement || windowState.isMaximized) return;
    
    const window = windowRef.current;
    if (!window) return;

    setWindowState(prev => ({ ...prev, isDragging: true }));
    window.classList.add('dragging');
    bringToFront(id);

    dragStartPosRef.current = {
      x: e.clientX - window.offsetLeft,
      y: e.clientY - window.offsetTop
    };

    e.preventDefault();
  }, [windowState.isMaximized, bringToFront, id]);

  useEffect(() => {
    if (!windowState.isDragging) return;

    const window = windowRef.current;
    if (!window) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!windowState.isDragging || !dragStartPosRef.current) return;

      animationFrameRef.current = requestAnimationFrame(() => {
        const newX = e.clientX - dragStartPosRef.current!.x;
        const newY = e.clientY - dragStartPosRef.current!.y;
        
        const maxX = window.parentElement?.clientWidth ?? window.ownerDocument.documentElement.clientWidth;
        const maxY = (window.parentElement?.clientHeight ?? window.ownerDocument.documentElement.clientHeight) - 28;
        
        const boundedX = Math.max(0, Math.min(newX, maxX - window.offsetWidth));
        const boundedY = Math.max(0, Math.min(newY, maxY - window.offsetHeight));
        
        setWindowState(prev => ({
          ...prev,
          position: { x: boundedX, y: boundedY }
        }));
      });
    };

    const handleMouseUp = () => {
      setWindowState(prev => ({ ...prev, isDragging: false }));
      window.classList.remove('dragging');
      dragStartPosRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [windowState.isDragging]);

  const handleMaximize = useCallback(() => {
    const window = windowRef.current;
    if (!window) return;

    if (!windowState.isMaximized) {
      setPreMaximizeState({
        position: windowState.position,
        size: windowState.size
      });

      setWindowState(prev => ({
        ...prev,
        position: { x: 0, y: 0 },
        size: {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight - 28
        },
        isMaximized: true
      }));
    } else {
      if (preMaximizeState) {
        setWindowState(prev => ({
          ...prev,
          position: preMaximizeState.position,
          size: preMaximizeState.size,
          isMaximized: false
        }));
      }
    }
  }, [windowState.isMaximized, windowState.position, preMaximizeState]);

  const handleMinimize = useCallback(() => {
    setWindowState(prev => ({ ...prev, isMinimized: true }));
    onMinimize();
  }, [onMinimize]);

  return {
    windowRef,
    windowState,
    handleMouseDown,
    handleMaximize,
    handleMinimize
  };
}; 