/**
 * Global hotkey registration
 * Manages system-wide keyboard shortcuts
 */

import { globalShortcut, BrowserWindow } from 'electron';
import { getHotkeySettings } from '../storage/repo/settingsRepo';

/**
 * Register all global hotkeys
 */
export function registerHotkeys(mainWindow: BrowserWindow): void {
  const settings = getHotkeySettings();

  // Quick capture hotkey
  if (settings.quickCapture) {
    try {
      globalShortcut.register(settings.quickCapture, () => {
        console.log('Quick capture triggered');
        mainWindow.webContents.send('hotkey:quick-capture');

        // Show window if hidden
        if (!mainWindow.isVisible()) {
          mainWindow.show();
        }

        // Focus window
        mainWindow.focus();
      });
      console.log(`Registered quick capture hotkey: ${settings.quickCapture}`);
    } catch (error) {
      console.error('Failed to register quick capture hotkey:', error);
    }
  }

  // Search hotkey
  if (settings.search) {
    try {
      globalShortcut.register(settings.search, () => {
        console.log('Search triggered');
        mainWindow.webContents.send('hotkey:search');

        // Show window if hidden
        if (!mainWindow.isVisible()) {
          mainWindow.show();
        }

        // Focus window
        mainWindow.focus();
      });
      console.log(`Registered search hotkey: ${settings.search}`);
    } catch (error) {
      console.error('Failed to register search hotkey:', error);
    }
  }
}

/**
 * Unregister all global hotkeys
 */
export function unregisterHotkeys(): void {
  globalShortcut.unregisterAll();
  console.log('Unregistered all hotkeys');
}

/**
 * Update hotkeys (unregister old, register new)
 */
export function updateHotkeys(mainWindow: BrowserWindow): void {
  unregisterHotkeys();
  registerHotkeys(mainWindow);
}
