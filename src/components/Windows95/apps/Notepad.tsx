import React, { useState, useCallback, useRef } from 'react';

interface MenuState {
  isOpen: string | null;
  position: { x: number; y: number } | null;
}

interface DropdownMenuProps {
  items: { label: string; action?: () => void; disabled?: boolean }[];
  position: { x: number; y: number };
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, position, onClose }) => {
  return (
    <div 
      className="win95-context-menu"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.label === '-' ? (
            <div className="win95-context-menu-separator" />
          ) : (
            <div 
              className={`win95-context-menu-item ${item.disabled ? 'opacity-50' : ''}`}
              onClick={() => {
                if (!item.disabled && item.action) {
                  item.action();
                  onClose();
                }
              }}
            >
              {item.label}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Notepad: React.FC = () => {
  const [content, setContent] = useState('');
  const [isWordWrap, setIsWordWrap] = useState(false);
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true);
  const [menuState, setMenuState] = useState<MenuState>({
    isOpen: null,
    position: null
  });
  const [fileName, setFileName] = useState('Untitled');
  const [isModified, setIsModified] = useState(false);
  const [selection, setSelection] = useState({
    start: 0,
    end: 0
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'a':
          e.preventDefault();
          e.currentTarget.select();
          break;
        case 's':
          e.preventDefault();
          handleSave();
          break;
        case 'n':
          e.preventDefault();
          handleNew();
          break;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newContent = content.substring(0, start) + '    ' + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
    updateSelection(e.target);
  };

  const updateSelection = (target: HTMLTextAreaElement) => {
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd
    });
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    updateSelection(e.target as HTMLTextAreaElement);
  };

  const handleMenuClick = (menuName: string, e: React.MouseEvent) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setMenuState({
      isOpen: menuState.isOpen === menuName ? null : menuName,
      position: { x: rect.left, y: rect.bottom }
    });
  };

  const handleMenuClose = useCallback(() => {
    setMenuState({ isOpen: null, position: null });
  }, []);

  // File operations
  const handleNew = () => {
    if (isModified) {
      // In a real app, we'd show a save prompt here
      if (window.confirm('Do you want to save changes?')) {
        handleSave();
      }
    }
    setContent('');
    setFileName('Untitled');
    setIsModified(false);
  };

  const handleSave = () => {
    // In a real app, this would open a save dialog
    setIsModified(false);
  };

  // Edit operations
  const handleCut = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      navigator.clipboard.writeText(content.substring(start, end));
      const newContent = content.substring(0, start) + content.substring(end);
      setContent(newContent);
      setIsModified(true);
    }
  };

  const handleCopy = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      navigator.clipboard.writeText(content.substring(start, end));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newContent = content.substring(0, start) + text + content.substring(end);
        setContent(newContent);
        setIsModified(true);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const getCurrentLine = () => {
    const lines = content.substring(0, selection.start).split('\n');
    return lines.length;
  };

  const getCurrentColumn = () => {
    const lines = content.substring(0, selection.start).split('\n');
    return lines[lines.length - 1].length + 1;
  };

  const getSelectedLength = () => {
    return Math.abs(selection.end - selection.start);
  };

  const menus = {
    file: [
      { label: 'New', action: handleNew },
      { label: 'Open...', disabled: true },
      { label: 'Save', action: handleSave },
      { label: 'Save As...', disabled: true },
      { label: '-' },
      { label: 'Page Setup...', disabled: true },
      { label: 'Print...', disabled: true },
      { label: '-' },
      { label: 'Exit', disabled: true }
    ],
    edit: [
      { label: 'Undo', disabled: true },
      { label: '-' },
      { label: 'Cut', action: handleCut },
      { label: 'Copy', action: handleCopy },
      { label: 'Paste', action: handlePaste },
      { label: 'Delete', disabled: true },
      { label: '-' },
      { label: 'Select All', action: () => textareaRef.current?.select() }
    ],
    format: [
      { label: 'Word Wrap', action: () => setIsWordWrap(!isWordWrap) },
      { label: 'Font...', disabled: true }
    ],
    view: [
      { label: 'Status Bar', action: () => setIsStatusBarVisible(!isStatusBarVisible) }
    ],
    help: [
      { label: 'Help Topics', disabled: true },
      { label: '-' },
      { label: 'About Notepad', disabled: true }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[var(--win95-window-bg)]">
      <div className="win95-window-menubar">
        {Object.entries(menus).map(([key, items]) => (
          <div 
            key={key}
            className="win95-window-menubar-item"
            onClick={(e) => handleMenuClick(key, e)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        className="flex-1 resize-none p-1 font-mono text-sm border border-solid border-[var(--win95-border-inner-dark)]"
        style={{
          whiteSpace: isWordWrap ? 'pre-wrap' : 'pre',
          overflowWrap: isWordWrap ? 'break-word' : 'normal',
          overflowX: isWordWrap ? 'hidden' : 'auto',
          boxShadow: '1px 1px 0 0 var(--win95-border-inner-light) inset',
          outline: 'none',
          backgroundColor: 'white'
        }}
        spellCheck={false}
      />

      {isStatusBarVisible && (
        <div className="flex items-center text-xs p-1 border-t border-[var(--win95-border-inner-dark)]">
          <div className="flex-1 pl-2">
            Ln {getCurrentLine()}, Col {getCurrentColumn()}
          </div>
          {getSelectedLength() > 0 && (
            <div className="mr-4">
              {getSelectedLength()} character(s) selected
            </div>
          )}
          <div className="pr-2">{isWordWrap ? 'Word Wrap' : 'No Wrap'}</div>
        </div>
      )}

      {menuState.isOpen && menuState.position && (
        <>
          <div 
            className="fixed inset-0 z-50"
            onClick={handleMenuClose}
          />
          <DropdownMenu
            items={menus[menuState.isOpen as keyof typeof menus]}
            position={menuState.position}
            onClose={handleMenuClose}
          />
        </>
      )}
    </div>
  );
};

export default Notepad;