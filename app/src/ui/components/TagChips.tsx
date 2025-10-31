/**
 * Tag Chips Component
 * Displays and manages tags
 */

import React, { useState } from 'react';

interface TagChipsProps {
  tags: string[];
  onChange?: (tags: string[]) => void;
  editable?: boolean;
}

function TagChips({ tags, onChange, editable = false }: TagChipsProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (tag: string) => {
    if (!tag.trim() || tags.includes(tag.trim())) {
      return;
    }

    onChange?.([...tags, tag.trim()]);
    setInputValue('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange?.(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1]);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', alignItems: 'center' }}>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 8px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-xs)',
            gap: 'var(--spacing-xs)',
          }}
        >
          {tag}
          {editable && onChange && (
            <button
              onClick={() => handleRemoveTag(tag)}
              style={{
                color: 'white',
                fontSize: 'var(--font-size-sm)',
                marginLeft: '4px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          )}
        </span>
      ))}

      {editable && onChange && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) {
              handleAddTag(inputValue);
            }
          }}
          placeholder="Add tag..."
          style={{
            border: 'none',
            outline: 'none',
            fontSize: 'var(--font-size-xs)',
            padding: '4px 8px',
            minWidth: '80px',
          }}
        />
      )}
    </div>
  );
}

export default TagChips;
