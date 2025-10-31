/**
 * Settings Repository
 * Handles application settings storage and retrieval
 */

import { getDatabase } from '../db';

export interface Setting {
  key: string;
  value_json: string;
  updated_at: string;
}

/**
 * Get a setting by key
 */
export function getSetting<T = any>(key: string): T | null {
  const db = getDatabase();
  const setting = db
    .prepare('SELECT * FROM settings WHERE key = ?')
    .get(key) as Setting | undefined;

  if (!setting) {
    return null;
  }

  try {
    return JSON.parse(setting.value_json) as T;
  } catch {
    return null;
  }
}

/**
 * Set a setting value
 */
export function setSetting<T = any>(key: string, value: T): void {
  const db = getDatabase();
  const now = new Date().toISOString();
  const valueJson = JSON.stringify(value);

  db.prepare(`
    INSERT INTO settings (key, value_json, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value_json = excluded.value_json,
      updated_at = excluded.updated_at
  `).run(key, valueJson, now);
}

/**
 * Get all settings
 */
export function getAllSettings(): Record<string, any> {
  const db = getDatabase();
  const settings = db.prepare('SELECT * FROM settings').all() as Setting[];

  const result: Record<string, any> = {};

  for (const setting of settings) {
    try {
      result[setting.key] = JSON.parse(setting.value_json);
    } catch {
      result[setting.key] = null;
    }
  }

  return result;
}

/**
 * Delete a setting
 */
export function deleteSetting(key: string): boolean {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM settings WHERE key = ?').run(key);
  return result.changes > 0;
}

/**
 * Get theme settings
 */
export function getThemeSettings(): {
  mode: 'light' | 'dark';
  accentColor: string;
} {
  return getSetting('theme') || { mode: 'light', accentColor: '#6366f1' };
}

/**
 * Set theme settings
 */
export function setThemeSettings(theme: {
  mode?: 'light' | 'dark';
  accentColor?: string;
}): void {
  const current = getThemeSettings();
  setSetting('theme', { ...current, ...theme });
}

/**
 * Get hotkey settings
 */
export function getHotkeySettings(): {
  quickCapture: string;
  search: string;
} {
  return getSetting('hotkeys') || {
    quickCapture: 'CmdOrCtrl+Shift+N',
    search: 'CmdOrCtrl+K',
  };
}

/**
 * Set hotkey settings
 */
export function setHotkeySettings(hotkeys: {
  quickCapture?: string;
  search?: string;
}): void {
  const current = getHotkeySettings();
  setSetting('hotkeys', { ...current, ...hotkeys });
}

/**
 * Get semantic settings
 */
export function getSemanticSettings(): {
  linkThreshold: number;
  autoExtract: boolean;
} {
  return getSetting('semantics') || {
    linkThreshold: 0.3,
    autoExtract: true,
  };
}

/**
 * Set semantic settings
 */
export function setSemanticSettings(settings: {
  linkThreshold?: number;
  autoExtract?: boolean;
}): void {
  const current = getSemanticSettings();
  setSetting('semantics', { ...current, ...settings });
}

/**
 * Get digest settings
 */
export function getDigestSettings(): {
  enabled: boolean;
  time: string;
} {
  return getSetting('digest') || {
    enabled: true,
    time: '09:00',
  };
}

/**
 * Set digest settings
 */
export function setDigestSettings(settings: {
  enabled?: boolean;
  time?: string;
}): void {
  const current = getDigestSettings();
  setSetting('digest', { ...current, ...settings });
}
