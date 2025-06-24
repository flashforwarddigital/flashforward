import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Window from './Window';
import Taskbar from './Taskbar';
import DesktopContextMenu from './DesktopContextMenu';
import TutorialPopup from './TutorialPopup';
import { WindowsContextProvider } from '../../contexts/WindowsContext';
import { AppData, AppConfig, initialAppData, AppContentProps } from '../../data/appData.tsx';
import { Windows95DesktopProps } from '../../types';
import useSound from 'use-sound';
import '../../styles/windows95.css';
import { WindowType } from '../../types/window';
import { posthog } from '../../lib/posthog';

interface ContextMenuPosition {
  x: number;
  y: number;
}

// Define a type that combines AppConfig and the dynamic app structure
type CombinedAppConfig = AppConfig | {
  content: React.ReactNode;
  title: string;
  name?: string;
  defaultSize?: { width: number; height: number };
  position?: { x: number; y: number };
  contentType?: string;
  url?: string;
  icon?: string;
  type?: WindowType;
  isResizable?: boolean;
  isAlwaysOnTop?: boolean;
};

const Desktop: React.FC<Windows95DesktopProps> = ({ onBack }) => {
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [minimizedApps, setMinimizedApps] = useState<string[]>([]);
  const [appData] = useState<AppData>(initialAppData);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [dynamicApps, setDynamicApps] = useState<{ [key: string]: { content: React.ReactNode, title: string, position?: { x: number; y: number } } }>({});
  
  const [playMinimize] = useSound('/sounds/windows95-minimize.mp3');
  const [playMaximize] = useSound('/sounds/windows95/sounds/windows95-maximize.mp3');

  useEffect(() => {
    // Track page view with PostHog
    posthog.capture('page_view', { page: 'windows95_desktop' });
  }, []);

  const tutorialSteps = [
    {
      message: "Welcome to 1996",
      position: { x: 200, y: 200 }
    },
    {
      message: "Feel free to explore the site! Double-click on icons to open them and have some fun.",
      position: { x: 250, y: 250 }
    },
    {
      message: "The Flash Forward folder contains our digital agency services. Take a look inside. Click on 'Update' if you want to update the website to a 2025 one!",
      position: { x: 300, y: 300 }
    }
  ];

  const handleTutorialClose = () => {
    posthog.capture('tutorial_step_completed', { step: currentTutorialStep + 1 });
    setCurrentTutorialStep(prev => prev + 1);
  };

  const handleOpenApp = (appId: string, content?: React.ReactNode, title?: string, positionOverride?: { x: number; y: number }) => {
    console.log(`Attempting to open app: ${appId}`);
    console.log('Content provided:', content ? 'Yes' : 'No', 'Title provided:', title);

    // Track app opening with PostHog
    posthog.capture('app_opened', { app_id: appId });

    if (content !== undefined && title !== undefined) {
      // Handle dynamic apps (like iframe games opened by GenericFolder)
      setDynamicApps(prev => ({ ...prev, [appId]: { content, title, position: positionOverride } }));
      if (!openApps.includes(appId)) {
        setOpenApps(prev => [...prev, appId]);
      }
      if (minimizedApps.includes(appId)) {
        setMinimizedApps(prev => prev.filter(id => id !== appId));
        playMaximize();
      }
    } else if (appData[appId]) {
      // Handle predefined apps from appData
      if (!openApps.includes(appId)) {
        setOpenApps(prev => [...prev, appId]);
      }
      if (minimizedApps.includes(appId)) {
        setMinimizedApps(prev => prev.filter(id => id !== appId));
        playMaximize();
      }
      // Store positionOverride for predefined apps as well
      if (positionOverride) {
        setDynamicApps(prev => ({ ...prev, [appId]: { ...prev[appId], position: positionOverride } }));
      }
    } else {
      console.error(`Data for app ${appId} not found.`);
    }
  };

  const handleCloseApp = (appId: string) => {
    // Track app closing with PostHog
    posthog.capture('app_closed', { app_id: appId });
    
    setOpenApps(prev => prev.filter(id => id !== appId));
    setMinimizedApps(prev => prev.filter(id => id !== appId));
    // Remove dynamic app data when closed
    if (dynamicApps[appId]) {
      setDynamicApps(prev => {
        const newDynamicApps = { ...prev };
        delete newDynamicApps[appId];
        return newDynamicApps;
      });
    }
  };

  const handleMinimize = (appId: string) => {
    // Track app minimizing with PostHog
    posthog.capture('app_minimized', { app_id: appId });
    
    if (!minimizedApps.includes(appId)) {
      setMinimizedApps(prev => [...prev, appId]);
      playMinimize();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Only show context menu if clicking directly on the desktop
    if (e.target === e.currentTarget) {
      setContextMenu({ x: e.clientX, y: e.clientY });
      
      // Track context menu opening with PostHog
      posthog.capture('desktop_context_menu_opened');
    }
  };

  const handleArrangeIcons = () => {
    // Implement icon arrangement logic
    console.log('Arranging icons...');
    posthog.capture('desktop_icons_arranged');
  };

  const handleRefresh = () => {
    // Implement refresh logic
    console.log('Refreshing desktop...');
    posthog.capture('desktop_refreshed');
  };

  const handleNewFolder = () => {
    // Implement new folder creation logic
    console.log('Creating new folder...');
    posthog.capture('new_folder_created');
  };

  return (
    <WindowsContextProvider onBack={onBack}>
      <div 
        className="win95"
        onContextMenu={handleContextMenu}
        onClick={() => setContextMenu(null)}
      >
        {currentTutorialStep < tutorialSteps.length && (
          <TutorialPopup
            message={tutorialSteps[currentTutorialStep].message}
            onClose={handleTutorialClose}
            position={tutorialSteps[currentTutorialStep].position}
          />
        )}
        
        {/* Render predefined app icons */}
        {Object.entries(appData).map(([id, app]) => (
          // Only render icons that have a position defined (i.e., are on the desktop)
          app.position && (app.position.x > 0 || app.position.y > 0) ? (
          <Icon 
            key={id}
            id={id}
            name={app.name}
            icon={app.icon}
              x={app.position.x * 0.95}
              y={app.position.y * 0.95}
            onOpen={() => handleOpenApp(id, app.contentType === 'component' ? React.createElement(app.component as React.ComponentType<AppContentProps>, { onOpenApp: handleOpenApp }) : undefined, app.name)}
          />
          ) : null
        ))}
        
        {/* Render predefined and dynamic app windows */}
        {[...openApps].map(appId => {
          const dynamicApp = dynamicApps[appId];
          const predefinedApp = appData[appId];
          const app: CombinedAppConfig = dynamicApp || predefinedApp; // Explicitly type app
          const isMinimized = minimizedApps.includes(appId);
          
          // Check if app data exists before rendering Window
          if (!app) {
            console.error(`Data for app ${appId} not found.`);
            return null; // Don't render if data is missing
          }

          // Determine the content to render based on contentType
          let contentToRender: React.ReactNode = null;

          if (dynamicApp) {
              contentToRender = dynamicApp.content; // Use dynamic content if available
          } else if (predefinedApp) {
              switch (predefinedApp.contentType) {
                  case 'component':
                      // For components, render the component and pass onOpenApp if needed
                      if (predefinedApp.component) {
                          // Consistently pass onOpenApp to all component types. Components that don't need it can ignore the prop.
                          contentToRender = React.createElement(predefinedApp.component as React.ComponentType<AppContentProps>, { onOpenApp: handleOpenApp });
                      }
                      break;
                  case 'iframe':
                      // For iframes, render the iframe structure
                      if (predefinedApp.url) {
                           contentToRender = (
                               <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                   <iframe 
                                       src={predefinedApp.url}
                                       style={{
                                           width: '100%',
                                           height: '100%',
                                           border: 'none',
                                           backgroundColor: '#000'
                                       }}
                                       title={app.name || 'Unknown'} // Use app.name
                                       allow="fullscreen"
                                   />
                               </div>
                           );
                      }
                      break;
                  case 'none':
                      // For 'none' type, render nothing or default content
                      contentToRender = null;
                      break;
              }
          }

          // Position AI tools more towards the center of the screen
          let position = dynamicApp?.position || app.position || { x: 100, y: 100 };
          if (appId.includes('chatbot') || appId.includes('imageGenerator') || 
              appId.includes('voicebot') || appId.includes('gpt90s')) {
            position = { x: 300, y: 100 };
          }

          return (
            <Window
              key={appId}
              id={appId}
              title={app.name || dynamicApp?.title || 'Unknown'}
              initialPosition={position}
              initialSize={predefinedApp?.defaultSize || { width: 400, height: 300 }}
              onClose={() => handleCloseApp(appId)}
              onMinimize={() => handleMinimize(appId)}
              isMinimized={isMinimized}
              content={contentToRender}
              className={appId.startsWith('external-') ? 'win95-game-window' : ''}
              isResizable={app.isResizable}
              isAlwaysOnTop={app.isAlwaysOnTop}
            />
          );
        })}
        
        {contextMenu && (
          <DesktopContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onArrange={handleArrangeIcons}
            onRefresh={handleRefresh}
            onNewFolder={handleNewFolder}
          />
        )}
        
        <Taskbar 
          openApps={openApps.map(id => ({
            id,
            name: dynamicApps[id]?.title || appData[id]?.name || 'Unknown', // Use title for dynamic, name for predefined
            isMinimized: minimizedApps.includes(id)
          }))}
          onAppClick={handleOpenApp}
          onBack={() => {
            posthog.capture('windows95_exit');
            onBack();
          }}
        />
      </div>
    </WindowsContextProvider>
  );
};

export default Desktop;