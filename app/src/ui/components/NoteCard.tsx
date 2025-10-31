/**
 * Note Card Component
 * Displays a note in card format
 */

import React from 'react';
import { Link } from 'react-router-dom';
import TagChips from './TagChips';

interface Note {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  tags_json: string;
}

interface NoteCardProps {
  note: Note;
}

function NoteCard({ note }: NoteCardProps) {
  const tags = JSON.parse(note.tags_json || '[]');
  const preview = note.body.slice(0, 150) + (note.body.length > 150 ? '...' : '');
  const updatedDate = new Date(note.updated_at).toLocaleDateString();

  return (
    <Link
      to={`/note/${note.id}`}
      style={{
        display: 'block',
        padding: 'var(--spacing-md)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--color-bg-primary)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Title */}
      <h3
        style={{
          marginBottom: 'var(--spacing-sm)',
          fontSize: 'var(--font-size-lg)',
          fontWeight: '600',
        }}
      >
        {note.title || 'Untitled'}
      </h3>

      {/* Preview */}
      <p
        style={{
          marginBottom: 'var(--spacing-md)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
          lineHeight: '1.5',
        }}
      >
        {preview}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
          <TagChips tags={tags} />
        </div>
      )}

      {/* Metadata */}
      <div
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-tertiary)',
        }}
      >
        Updated {updatedDate}
      </div>
    </Link>
  );
}

export default NoteCard;
