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
  
  // Adjust initial position for mobile viewport
  const adjustedInitialPosition = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // If window would be off-screen, adjust it
    let x = initialPosition.x;
    let y = initialPosition.y;
    
    // Make sure window is not positioned off the right edge
    if (x + initialSize.width > viewportWidth) {
      x = Math.max(0, viewportWidth - initialSize.width - 10);
    }
    
    // Make sure window is not positioned off the bottom edge
    if (y + initialSize.height > viewportHeight - 28) { // 28px for taskbar
      y = Math.max(0, viewportHeight - initialSize.height - 38); // Extra 10px buffer
    }
    
    // For small screens, center windows
    if (viewportWidth < 768) {
      x = Math.max(0, (viewportWidth - initialSize.width) / 2);
      y = Math.max(0, (viewportHeight - initialSize.height - 28) / 3); // Position in upper third
    }
    
    return { x, y };
  }, [initialPosition, initialSize]);

  const [windowState, setWindowState] = useState<WindowState>({
    position: adjustedInitialPosition(),
    size: initialSize,
    isMaximized: false,
    isMinimized: false,
    isDragging: false,
    zIndex: 0,
    type: type
  });

  const [preMaximizeState, setPreMaximizeState] = useState<{position: Position, size: Size} | null>(null);

  // Recalculate position when window size changes
  useEffect(() => {
    const handleResize = () => {
      if (windowState.isMaximized) return;
      
      setWindowState(prev => ({
        ...prev,
        position: adjustedInitialPosition()
      }));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustedInitialPosition, windowState.isMaximized]);

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
    
    // Also handle touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!windowState.isDragging || !dragStartPosRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      
      animationFrameRef.current = requestAnimationFrame(() => {
        const newX = touch.clientX - dragStartPosRef.current!.x;
        const newY = touch.clientY - dragStartPosRef.current!.y;
        
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
    
    const handleTouchEnd = () => {
      setWindowState(prev => ({ ...prev, isDragging: false }));
      window.classList.remove('dragging');
      dragStartPosRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
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