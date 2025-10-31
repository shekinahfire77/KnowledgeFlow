/**
 * Quick Capture Overlay
 * Modal for quickly capturing notes
 */

import React, { useState, useRef, useEffect } from 'react';

interface CaptureOverlayProps {
  onClose: () => void;
}

function CaptureOverlay({ onClose }: CaptureOverlayProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSave = async () => {
    if (!title.trim() && !body.trim()) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      // TODO: Replace with actual IPC call
      // await window.electron.invoke('notes:create', {
      //   title: title || 'Quick Note',
      //   body,
      //   tags: ['quick-capture'],
      // });
      onClose();
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderRadius: 'var(--radius-lg)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--spacing-md)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0 }}>Quick Capture</h2>
          <button
            onClick={onClose}
            style={{
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--spacing-md)' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              borderBottom: '1px solid var(--color-border)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              padding: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-md)',
              outline: 'none',
            }}
          />

          <textarea
            placeholder="Start writing..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{
              width: '100%',
              height: '200px',
              border: 'none',
              fontSize: 'var(--font-size-base)',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 'var(--spacing-md)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-sm)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaptureOverlay;
