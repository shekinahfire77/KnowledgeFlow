/**
 * Notes List Page
 * Displays all notes with search and filtering
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoteCard from '../components/NoteCard';

interface Note {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  tags_json: string;
}

function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual IPC call
      // const result = await window.electron.invoke('notes:list', {});
      // setNotes(result);

      // Stub data for development
      setNotes([]);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadNotes();
      return;
    }

    try {
      // TODO: Replace with actual IPC call
      // const result = await window.electron.invoke('notes:search', query);
      // setNotes(result);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <h1>Notes</h1>
        <Link
          to="/note/new"
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
          }}
        >
          New Note
        </Link>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          style={{
            width: '100%',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)',
          }}
        />
      </div>

      {/* Notes grid */}
      {loading ? (
        <div>Loading notes...</div>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
          <p>No notes yet. Create your first note to get started!</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--spacing-md)',
          }}
        >
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesList;
