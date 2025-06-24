import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WindowsContextType, WindowState } from '../types/windows';

const WindowsContext = createContext<WindowsContextType | undefined>(undefined);

export const useWindowsContext = () => {
  const context = useContext(WindowsContext);
  if (context === undefined) {
    throw new Error('useWindowsContext must be used within a WindowsContextProvider');
  }
  return context;
};

interface WindowsContextProviderProps {
  children: React.ReactNode;
  onBack: () => void;
}

export const WindowsContextProvider: React.FC<WindowsContextProviderProps> = ({ children, onBack }) => {
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({});
  const [windowStates, setWindowStates] = useState<Record<string, WindowState>>({});

  const bringToFront = useCallback((id: string) => {
    setZIndexes(current => {
      const maxZIndex = Math.max(100, ...Object.values(current));
      const newHighest = maxZIndex + 1;
      const newZIndexes = { ...current };
      newZIndexes[id] = newHighest;
      return newZIndexes;
    });
  }, []);

  const setWindowState = useCallback((id: string, state: Partial<WindowState>) => {
    setWindowStates(current => ({
      ...current,
      [id]: {
        ...current[id],
        ...state
      }
    }));
  }, []);

  const getWindowState = useCallback((id: string) => {
    return windowStates[id];
  }, [windowStates]);

  const setAlwaysOnTop = useCallback((id: string, isAlwaysOnTop: boolean) => {
    setWindowState(id, { isAlwaysOnTop });
    if (isAlwaysOnTop) {
      bringToFront(id);
    }
  }, [setWindowState, bringToFront]);

  useEffect(() => {
    const updateZIndexes = () => {
      Object.entries(zIndexes).forEach(([id, zIndex]) => {
        const element = document.querySelector(`[data-window-id="${id}"]`);
        if (element) {
          const state = windowStates[id];
          const baseZIndex = state?.isAlwaysOnTop ? 10000 : zIndex;
          (element as HTMLElement).style.zIndex = baseZIndex.toString();
        }
      });
    };

    const animationFrame = requestAnimationFrame(updateZIndexes);
    return () => cancelAnimationFrame(animationFrame);
  }, [zIndexes, windowStates]);

  const value = {
    bringToFront,
    zIndexes,
    setWindowState,
    getWindowState,
    setAlwaysOnTop,
    onBack,
  };

  return (
    <WindowsContext.Provider value={value}>
      {children}
    </WindowsContext.Provider>
  );
};