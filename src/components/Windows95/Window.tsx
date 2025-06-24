import React, { useEffect, useRef } from 'react';
import { useWindowsContext } from '../../contexts/WindowsContext';
import useSound from 'use-sound';
import { WindowProps } from '../../types/window';
import { useWindowManager } from '../../hooks/useWindowManager';

const Window: React.FC<WindowProps> = ({ 
  id, 
  title, 
  initialPosition, 
  initialSize, 
  onClose, 
  onMinimize,
  isMinimized,
  content,
  className,
  type,
  isResizable
}) => {
  const { bringToFront } = useWindowsContext();
  const [playMaximize] = useSound('/sounds/windows95-maximize.mp3');
  const [playMinimize] = useSound('/sounds/windows95-minimize.mp3');
  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  const {
    windowRef,
    windowState,
    handleMouseDown,
    handleMaximize,
    handleMinimize
  } = useWindowManager({
    id,
    initialPosition,
    initialSize,
    onMinimize,
    bringToFront,
    type: type || 'default'
  });

  useEffect(() => {
    if (windowRef.current) {
      bringToFront(id);
    }
  }, [id, bringToFront]);

  const handleMinimizeClick = () => {
    playMinimize();
    handleMinimize();
  };

  const handleMaximizeClick = () => {
    playMaximize();
    handleMaximize();
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.target instanceof HTMLButtonElement || windowState.isMaximized) return;
    
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    
    // Simulate mouse down for drag
    handleMouseDown({
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => {},
      target: e.target
    } as unknown as React.MouseEvent);
  };

  if (isMinimized) {
    return null;
  }

  // Adjust window size for mobile
  const adjustWindowSize = () => {
    if (window.innerWidth < 768 && !windowState.isMaximized) {
      // For small screens, make windows more appropriate for the viewport
      const maxWidth = Math.min(windowState.size.width, window.innerWidth - 20);
      const maxHeight = Math.min(windowState.size.height, window.innerHeight - 60);
      
      return {
        width: maxWidth,
        height: maxHeight
      };
    }
    
    return windowState.size;
  };

  const adjustedSize = adjustWindowSize();

  return (
    <div
      ref={windowRef}
      className={`win95-window ${windowState.isMaximized ? 'maximized' : ''} ${className || ''}`}
      style={{
        position: 'absolute',
        left: `${windowState.position.x}px`,
        top: `${windowState.position.y}px`,
        width: `${adjustedSize.width}px`,
        height: `${adjustedSize.height}px`,
        cursor: windowState.isDragging ? 'grabbing' : 'default',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100vw',
        maxHeight: `calc(100vh - 28px)` // Account for taskbar
      }}
      onClick={() => bringToFront(id)}
    >
      <div 
        className="win95-window-title"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ cursor: windowState.isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="win95-window-title-text">{title}</div>
        <div className="win95-window-controls">
          <button className="win95-window-button" onClick={handleMinimizeClick}>_</button>
          <button className="win95-window-button" onClick={handleMaximizeClick}>□</button>
          <button className="win95-window-button" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="win95-window-menubar">
        <div className="win95-window-menubar-item">File</div>
        <div className="win95-window-menubar-item">Edit</div>
        <div className="win95-window-menubar-item">View</div>
        <div className="win95-window-menubar-item">Help</div>
      </div>
      <div className="win95-window-content" style={{ flex: 1, overflow: 'hidden' }}>
        {content}
      </div>
      {isResizable && !windowState.isMaximized && (
        <div 
          className="win95-window-resize-handle"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '10px',
            height: '10px',
            cursor: 'nwse-resize'
          }}
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
};

export default Window;