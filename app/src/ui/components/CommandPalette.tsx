/**
 * Command Palette Component
 * Quick access to commands and navigation
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Command {
  id: string;
  label: string;
  action: () => void;
  category?: string;
}

interface CommandPaletteProps {
  onClose: () => void;
}

function CommandPalette({ onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define available commands
  const commands: Command[] = [
    {
      id: 'new-note',
      label: 'New Note',
      category: 'Create',
      action: () => {
        navigate('/note/new');
        onClose();
      },
    },
    {
      id: 'view-notes',
      label: 'View All Notes',
      category: 'Navigate',
      action: () => {
        navigate('/');
        onClose();
      },
    },
    {
      id: 'view-tasks',
      label: 'View Tasks',
      category: 'Navigate',
      action: () => {
        navigate('/tasks');
        onClose();
      },
    },
    {
      id: 'view-graph',
      label: 'View Knowledge Graph',
      category: 'Navigate',
      action: () => {
        navigate('/graph');
        onClose();
      },
    },
    {
      id: 'settings',
      label: 'Open Settings',
      category: 'Navigate',
      action: () => {
        navigate('/settings');
        onClose();
      },
    },
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
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
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div style={{ padding: 'var(--spacing-md)' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              border: 'none',
              fontSize: 'var(--font-size-lg)',
              outline: 'none',
            }}
          />
        </div>

        {/* Commands list */}
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {filteredCommands.length === 0 ? (
            <div
              style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
              }}
            >
              No commands found
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                onClick={() => command.action()}
                style={{
                  padding: 'var(--spacing-md)',
                  cursor: 'pointer',
                  backgroundColor: index === selectedIndex ? 'var(--color-bg-secondary)' : 'transparent',
                  borderLeft: index === selectedIndex ? '3px solid var(--color-primary)' : '3px solid transparent',
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={{ fontSize: 'var(--font-size-base)' }}>{command.label}</div>
                {command.category && (
                  <div
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-tertiary)',
                      marginTop: 'var(--spacing-xs)',
                    }}
                  >
                    {command.category}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
