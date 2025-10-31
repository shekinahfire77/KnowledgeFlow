/**
 * Settings Page
 * Application configuration and preferences
 */

import React, { useState, useEffect } from 'react';

interface Settings {
  theme: {
    mode: 'light' | 'dark';
    accentColor: string;
  };
  hotkeys: {
    quickCapture: string;
    search: string;
  };
  semantics: {
    linkThreshold: number;
    autoExtract: boolean;
  };
  digest: {
    enabled: boolean;
    time: string;
  };
}

function Settings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual IPC call
      // const result = await window.electron.invoke('settings:getAll');
      // setSettings(result);

      // Stub data for development
      setSettings({
        theme: { mode: 'light', accentColor: '#6366f1' },
        hotkeys: { quickCapture: 'CmdOrCtrl+Shift+N', search: 'CmdOrCtrl+K' },
        semantics: { linkThreshold: 0.3, autoExtract: true },
        digest: { enabled: true, time: '09:00' },
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      // TODO: Replace with actual IPC calls
      // await window.electron.invoke('settings:set', 'theme', settings.theme);
      // await window.electron.invoke('settings:set', 'hotkeys', settings.hotkeys);
      // await window.electron.invoke('settings:set', 'semantics', settings.semantics);
      // await window.electron.invoke('settings:set', 'digest', settings.digest);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div style={{ padding: 'var(--spacing-lg)' }}>Loading settings...</div>;
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Settings</h1>

      {/* Theme settings */}
      <section style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2>Theme</h2>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
            Theme Mode
            <select
              value={settings.theme.mode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  theme: { ...settings.theme, mode: e.target.value as 'light' | 'dark' },
                })
              }
              style={{
                marginLeft: 'var(--spacing-md)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </section>

      {/* Hotkeys settings */}
      <section style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2>Hotkeys</h2>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>
            Quick Capture
            <input
              type="text"
              value={settings.hotkeys.quickCapture}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hotkeys: { ...settings.hotkeys, quickCapture: e.target.value },
                })
              }
              style={{
                marginLeft: 'var(--spacing-md)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>
            Search
            <input
              type="text"
              value={settings.hotkeys.search}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hotkeys: { ...settings.hotkeys, search: e.target.value },
                })
              }
              style={{
                marginLeft: 'var(--spacing-md)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            />
          </label>
        </div>
      </section>

      {/* Semantic settings */}
      <section style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2>Semantic Features</h2>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>
            <input
              type="checkbox"
              checked={settings.semantics.autoExtract}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  semantics: { ...settings.semantics, autoExtract: e.target.checked },
                })
              }
              style={{ marginRight: 'var(--spacing-sm)' }}
            />
            Auto-extract tasks from notes
          </label>

          <label style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>
            Link Threshold
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={settings.semantics.linkThreshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  semantics: { ...settings.semantics, linkThreshold: parseFloat(e.target.value) },
                })
              }
              style={{
                marginLeft: 'var(--spacing-md)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                width: '100px',
              }}
            />
          </label>
        </div>
      </section>

      {/* Daily digest settings */}
      <section style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2>Daily Digest</h2>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>
            <input
              type="checkbox"
              checked={settings.digest.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  digest: { ...settings.digest, enabled: e.target.checked },
                })
              }
              style={{ marginRight: 'var(--spacing-sm)' }}
            />
            Enable daily digest
          </label>

          <label style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>
            Digest Time
            <input
              type="time"
              value={settings.digest.time}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  digest: { ...settings.digest, time: e.target.value },
                })
              }
              style={{
                marginLeft: 'var(--spacing-md)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            />
          </label>
        </div>
      </section>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-base)',
        }}
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}

export default Settings;
