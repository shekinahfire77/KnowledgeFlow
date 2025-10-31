/**
 * Keyboard Shortcuts Configuration
 * Defines all keyboard shortcuts used in the application
 */

export interface KeyboardShortcut {
  key: string;
  modifiers: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
  description: string;
  action: string;
}

export const keyboardMap: Record<string, KeyboardShortcut> = {
  // Global shortcuts
  quickCapture: {
    key: 'n',
    modifiers: { meta: true, shift: true },
    description: 'Open quick capture',
    action: 'quickCapture',
  },
  commandPalette: {
    key: 'k',
    modifiers: { meta: true },
    description: 'Open command palette',
    action: 'commandPalette',
  },
  search: {
    key: 'f',
    modifiers: { meta: true },
    description: 'Focus search',
    action: 'search',
  },

  // Navigation shortcuts
  newNote: {
    key: 'n',
    modifiers: { meta: true },
    description: 'Create new note',
    action: 'newNote',
  },
  goToNotes: {
    key: '1',
    modifiers: { meta: true },
    description: 'Go to notes',
    action: 'goToNotes',
  },
  goToTasks: {
    key: '2',
    modifiers: { meta: true },
    description: 'Go to tasks',
    action: 'goToTasks',
  },
  goToGraph: {
    key: '3',
    modifiers: { meta: true },
    description: 'Go to graph',
    action: 'goToGraph',
  },

  // Editor shortcuts
  save: {
    key: 's',
    modifiers: { meta: true },
    description: 'Save note',
    action: 'save',
  },
  bold: {
    key: 'b',
    modifiers: { meta: true },
    description: 'Bold text',
    action: 'bold',
  },
  italic: {
    key: 'i',
    modifiers: { meta: true },
    description: 'Italic text',
    action: 'italic',
  },
  link: {
    key: 'k',
    modifiers: { meta: true, shift: true },
    description: 'Insert link',
    action: 'link',
  },

  // General shortcuts
  escape: {
    key: 'Escape',
    modifiers: {},
    description: 'Close overlay/modal',
    action: 'escape',
  },
  enter: {
    key: 'Enter',
    modifiers: {},
    description: 'Confirm action',
    action: 'enter',
  },
};

/**
 * Format keyboard shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.modifiers.ctrl) parts.push('Ctrl');
  if (shortcut.modifiers.alt) parts.push('Alt');
  if (shortcut.modifiers.shift) parts.push('Shift');
  if (shortcut.modifiers.meta) parts.push(isMac() ? '⌘' : 'Ctrl');

  parts.push(shortcut.key.toUpperCase());

  return parts.join('+');
}

/**
 * Check if running on macOS
 */
export function isMac(): boolean {
  return typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

/**
 * Check if a keyboard event matches a shortcut
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  const ctrlMatch = !!shortcut.modifiers.ctrl === event.ctrlKey;
  const altMatch = !!shortcut.modifiers.alt === event.altKey;
  const shiftMatch = !!shortcut.modifiers.shift === event.shiftKey;
  const metaMatch = !!shortcut.modifiers.meta === event.metaKey;
  const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

  return ctrlMatch && altMatch && shiftMatch && metaMatch && keyMatch;
}
